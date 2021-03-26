const Publication = require('../models/Publication');
const Commentaire = require('../models/Commentaire');
const Likes = require('../models/Likes');
const Dislikes = require('../models/Dislikes');
const fs = require('fs');

exports.getAllPublication = (req, res, next) => {
    // moderateur voit toutes les publications, tous les commentaires
    if (req.userData.role === 'MODERATEUR') {
        Publication.findAll({
            include: Commentaire,
            order: [
                ['date_publication', 'DESC'],
                [Commentaire, 'date_publication', 'DESC']
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
        // les autres roles : uniquement les publications modérées avec les commentaires modérés
    } else {
        Publication.findAll({
            where: {modere: true},
            // include: Commentaire,
            include: [{
                model: Commentaire,
                where: {modere: true},
                required: false
            }],
            order: [
                ['date_publication', 'DESC'],
                [Commentaire, 'date_publication', 'DESC']
            ],
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
                return res.status(401).json({error: 'Publication non accessible, en attente de modération !'});
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
        } : { ...JSON.parse(req.body.publication) };

    Publication.update({ ...publicationObject }, {where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Publication modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deletePublication = async (req, res, next) => {
    Publication.findOne({
        where: { id: req.params.id }
    })
        .then(publication => {
            // seul l'utilisateur de la publication ou le moderateur peut delete
            if (publication.utilisateur_id === req.userData.userId || req.userData.role === 'MODERATEUR') {
                Likes.destroy({
                    where: {publication_id: req.params.id}
                });

                Dislikes.destroy({
                    where: {publication_id: req.params.id}
                });

                const filename = publication.image_url.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Publication.destroy({
                        where: { id: req.params.id }
                    })
                        .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
                        .catch(error => res.status(400).json({ error }));
                });
            } else {
                return res.status(401).json({error: 'Suppression non autorisée !'});
            }
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
