const Publication = require('../models/Publication');
const Utilisateur = require('../models/Utilisateur');
const Likes = require('../models/Likes');
const Dislikes = require('../models/Dislikes');
const fs = require('fs');
const { Op } = require("sequelize");

exports.getAllPublication = (req, res, next) => {
    let where = {};
    if (req.userData.role !== 'MODERATEUR') {
        where = {  [Op.or]: [ {modere: true}, {utilisateur_id: req.userData.userId} ] };
    }
    Publication.findAll({
        attributes: { exclude: ['utilisateur_id'] },
        where: where,
        include: [{
            model: Utilisateur,
            attributes: ['id', 'email_display', 'image_url', 'role']
        }],
        order: [
            ['date_publication', 'DESC']
        ],
    })
        .then((publications) => res.status(200).json(publications))
        .catch(error => res.status(400).json({ error }));
};

exports.getOnePublication = (req, res, next) => {
    res.status(200).json(req.publication);
};

exports.createPublication = (req, res, next) => {
    try {
        const publicationObject = JSON.parse(req.body.publication);
        Publication.create({
            description: publicationObject.description,
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            utilisateur_id: req.userData.userId
        })
            .then(() => res.status(201).json({ message: 'Publication enregistrée !'}))
            .catch(error => res.status(400).json({ error }));

    } catch (error) {
        return res.status(400).json({ error })
    }
};

exports.modifyPublication = (req, res, next) => {
    try {
        const publicationObject = req.body.publication;
        if (req.file) {
            publicationObject.image_url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        }
        if (req.userData.role !== 'MODERATEUR') {
            delete publicationObject.modere;
        }
        Publication.update(publicationObject, { where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: 'Publication modifiée !'}))
            .catch(error => res.status(400).json({ error }));
    } catch (error) {
        return res.status(400).json({ error })
    }
};

exports.deletePublication = (req, res, next) => {
    const { publication } = req;
    const filename = publication.image_url.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
        Publication.destroy({
            where: { id: req.params.id }
        })
            .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
            .catch(error => res.status(400).json({ error }));
    });
};

exports.likePublication = async (req, res, next) => {
    const userId = req.userData.userId;
    const like = req.body.like;
    switch (like) {
        case 1:
            try {
                await Dislikes.destroy({
                    where: {
                        publication_id: req.params.id,
                        utilisateur_id: userId
                    }
                });
                Likes.findOne({
                    where: {
                        publication_id: req.params.id,
                        utilisateur_id: userId
                    }
                })
                    .then(publication => {
                        if (!publication) {
                            Likes.create({ publication_id: req.params.id, utilisateur_id: userId })
                                .then(() => res.status(201).json({ message: 'Publication likée +1 !' }))
                                .catch(error => res.status(400).json({ error }));
                        } else {
                            return res.status(400).json({ error: 'Publication déjà likée !' });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            } catch (error) {
                return res.status(400).json({ error });
            }
            break;
        case -1:
            try {
                await Likes.destroy({
                    where: {
                        publication_id: req.params.id,
                        utilisateur_id: userId
                    }
                });
                Dislikes.findOne({
                    where: {
                        publication_id: req.params.id,
                        utilisateur_id: userId
                    }
                })
                    .then(publication => {
                        if (!publication) {
                            Dislikes.create({ publication_id: req.params.id, utilisateur_id: userId })
                                .then(() => res.status(201).json({ message: 'Publication dislikée -1 !' }))
                                .catch(error => res.status(400).json({ error }));
                        } else {
                            return res.status(400).json({ error: 'Publication déjà dislikée !' });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            } catch (error) {
                return res.status(500).json({ error });
            }
            break;
    }
};

exports.getLikePublication = async (req, res, next) => {
    try {
        req.likes = await Likes.count({
            where: { publication_id: req.params.id }
        });
        req.dislikes = await Dislikes.count({
            where: { publication_id: req.params.id }
        });
    } catch (error) {
        res.status(400).json({ error });
    } finally {
        res.status(200).json({ likes: req.likes, dislikes: req.dislikes })
    }
};
