const Publication = require('../models/Publication');
const Likes = require('../models/Likes');
const Dislikes = require('../models/Dislikes');
const fs = require('fs');
const jwt = require('jsonwebtoken');

exports.getAllPublication = (req, res, next) => {
    Publication.findAll().then(
        (publications) => {
            res.status(200).json(publications);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOnePublication = (req, res, next) => {
    Publication.findOne({
        where:  {id: req.params.id}
    }).then(
        (publication) => {
            res.status(200).json(publication);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.createPublication = (req, res, next) => {
    const publicationObject = JSON.parse(req.body.publication);

    // id de l'utilisateur connecté
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    Publication.create({
        description: publicationObject.description,
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        utilisateur_id: userId
    })
        .then(() => res.status(201).json({ message: 'Publication enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyPublication = (req, res, next) => {
    const publicationObject = req.file ?
        {
            ...JSON.parse(req.body.publication),
            image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Publication.update({ ...publicationObject }, {where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Publication modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deletePublication = (req, res, next) => {
    Publication.findOne({
        where: { id: req.params.id }
    })
        .then(publication => {
            const filename = publication.image_url.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Publication.destroy({
                where: { id: req.params.id }
            })
                    .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likePublication = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    switch (like) {
        case 1:
            Likes.findOne({
                where: {
                    publication_id: req.params.id,
                    utilisateur_id: userId
                }
            })
                .then(publication => {
                    if (!publication) {
                        // Dislikes.delete({
                        //     where: {
                        //         publication_id: req.params.id,
                        //         utilisateur_id: userId
                        //     }
                        // });
                        Likes.create({publication_id: req.params.id, utilisateur_id: userId})
                            .then(() => res.status(201).json({message: 'Publication likée +1 !'}))
                            .catch(error => res.status(400).json({error}));
                    } else {
                        return res.status(400).json({error: 'Publication déjà likée !'});
                    }
                })
                .catch(error => res.status(500).json({ error }));
            break;
        case -1:
            Dislikes.findOne({
                where: {
                    publication_id: req.params.id,
                    utilisateur_id: userId
                }
            })
                .then(publication => {
                    if (!publication) {
                        // Likes.delete({
                        //     where: {
                        //         publication_id: req.params.id,
                        //         utilisateur_id: userId
                        //     }
                        // });
                        Dislikes.create({publication_id: req.params.id, utilisateur_id: userId})
                            .then(() => res.status(201).json({message: 'Publication dislikée -1 !'}))
                            .catch(error => res.status(400).json({error}));
                    } else {
                        return res.status(400).json({error: 'Publication déjà dislikée !'});
                    }
                })
                .catch(error => res.status(500).json({ error }));
            break;
    }
};
