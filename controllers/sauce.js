const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    let message = 'Aucune modification !';

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (like) {
                case 1:
                    if (sauce.usersLiked.indexOf(userId) === -1) {
                        sauce.likes += 1;
                        sauce.usersLiked.push(userId);
                        message = 'Sauce likée !';
                    }
                    break;
                case -1:
                    if (sauce.usersDisliked.indexOf(userId) === -1) {
                        sauce.dislikes += 1;
                        sauce.usersDisliked.push(userId);
                        message = 'Sauce dislikée !';
                    }
                    break;
                case 0:
                    const indexLike = sauce.usersLiked.indexOf(userId);
                    const indexDislike = sauce.usersDisliked.indexOf(userId);
                    if (indexLike > -1) {
                        sauce.likes += -1;
                        sauce.usersLiked.splice(indexLike, 1);
                        message = 'Like annulé !';
                    } else if (indexDislike > -1) {
                        sauce.dislikes += -1;
                        sauce.usersDisliked.splice(indexDislike, 1);
                        message = 'Dislike annulé !';
                    }
                    break;
            }
            Sauce.findOneAndUpdate({ _id: req.params.id }, { $set: sauce } )
                .then(() => res.status(200).json({ message: message }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
