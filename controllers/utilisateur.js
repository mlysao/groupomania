const Utilisateur = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const maskData = require('maskdata');
const passwordValidator = require('password-validator');

exports.signup = (req, res, next) => {
    const schema = new passwordValidator();
    if (schema.is().min(8).validate(req.body.password)) {
        const file = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
        Utilisateur.create({
            email: req.body.email,
            email_display: maskData.maskEmail2(req.body.email),
            password: bcrypt.hashSync(req.body.password, 10),
            image_url: file
        })
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
            if (!utilisateur) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, utilisateur.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        utilisateur: {
                            id: utilisateur.id,
                            email_display: utilisateur.email_display,
                            role: utilisateur.role,
                            image_url: utilisateur.image_url
                        },
                        token: jwt.sign(
                            {userId: utilisateur.id, role: utilisateur.role},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.delete = (req, res, next) => {
    if (req.userData.userId === req.params.id || req.userData.role === 'MODERATEUR') {
        Utilisateur.destroy( {
            where: {id: req.params.id}
        })
            .then(() => res.status(200).json({ message: 'Utilisateur supprimé !'}))
            .catch(error => res.status(400).json({ error }));
    } else {
        return res.status(401).json({error: 'Utilisateur non accessible à la suppression !'});
    }
};
