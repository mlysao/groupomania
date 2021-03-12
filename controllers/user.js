const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const maskData = require('maskdata');
const passwordValidator = require('password-validator');

exports.signup = (req, res, next) => {
    const schema = new passwordValidator();

    if (schema.is().min(8).validate(req.body.password)) {
        const user = new User({
            email: req.body.email,
            emailDisplay: maskData.maskEmail2(req.body.email),
            password: bcrypt.hashSync(req.body.password, 10)
        });
        user.save()
            .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({error}));
    } else {
        return res.status(400).json({message: 'Le mot de passe doit faire au moins 8 caractères !'});
    }
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};
