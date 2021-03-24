const Utilisateur = require('../models/Utilisateur');
const Publication = require('../models/Publication');
const Likes = require('../models/Likes');
const Dislikes = require('../models/Dislikes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const maskData = require('maskdata');
const passwordValidator = require('password-validator');
const Sequelize = require("sequelize");

exports.signup = (req, res, next) => {
    const schema = new passwordValidator();
    if (schema.is().min(8).validate(req.body.password)) {
        Utilisateur.create({email: req.body.email, email_display: maskData.maskEmail2(req.body.email), password: bcrypt.hashSync(req.body.password, 10)})
            .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({error}));
    } else {
        return res.status(400).json({message: 'Le mot de passe doit faire au moins 8 caractères !'});
    }
};

exports.login = (req, res, next) => {
    Utilisateur.findOne({
        where: {email: req.body.email}
    })
        .then(utilisateur => {
            console.log(utilisateur)
            if (!utilisateur) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }

            bcrypt.compare(req.body.password, utilisateur.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: utilisateur.id,
                        token: jwt.sign(
                            {userId: utilisateur.id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.delete = async (req, res, next) => {
    await Likes.destroy({
        where: {utilisateur_id: req.params.id}
    });

    await Likes.destroy({
        where: {
            publication_id: {
                [Sequelize.Op.in]: Sequelize.literal(`(select id from publication where utilisateur_id=${req.params.id})`)
            }
        }
    });

    await Dislikes.destroy({
        where: {utilisateur_id: req.params.id}
    });

    await Dislikes.destroy({
        where: {
            publication_id: {
                [Sequelize.Op.in]: Sequelize.literal(`(select id from publication where utilisateur_id=${req.params.id})`)
            }
        }
    });

    Publication.destroy({
        where: {utilisateur_id: req.params.id}
    });

    Utilisateur.destroy( {
        where: {id: req.params.id}
    })
        .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};
