const Publication = require('../models/Publication');
const Likes = require('../models/Likes');
const Dislikes = require('../models/Dislikes');
const fs = require('fs');

exports.getAllPublication = (req, res, next) => {
    // moderateur voit toutes les publications
    if (req.userData.role === 'MODERATEUR') {
        Publication.findAll({
            order: [
                ['createdAt', 'DESC'],
            ]
        }).then(
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
        // les autres roles : uniquement les publications modérées
    } else {
        Publication.findAll({
            where: {modere: true},
            order: [
                ['createdAt', 'DESC'],
            ]
        }).then(
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
    }
};

exports.getOnePublication = (req, res, next) => {
    Publication.findOne({
        where:  {id: req.params.id}
    }).then(
        (publication) => {
            if (publication.modere || req.userData.role === 'MODERATEUR') {
                res.status(200).json(publication);
            } else {
                return res.status(401).json({error: 'Publication non accessible, en attente de modération'});
            }
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
    Publication.create({
        description: publicationObject.description,
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        utilisateur_id: req.userData.userId,
        modere: false
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

    // données jamais modifiables
    delete publicationObject.id;
    delete publicationObject.utilisateur_id;

    // seul le modérateur peut modifier cette donnée
    if (req.userData.role === 'UTILISATEUR') {
        delete publicationObject.modere;
    }

    Publication.update({ ...publicationObject }, {where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Publication modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deletePublication = async (req, res, next) => {
    await Likes.destroy({
        where: {publication_id: req.params.id}
    });

    await Dislikes.destroy({
        where: {publication_id: req.params.id}
    });

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

exports.likePublication = async (req, res, next) => {
    const userId = req.userData.userId;
    const like = req.body.like;
    switch (like) {
        case 1:
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
