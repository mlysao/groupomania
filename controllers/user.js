const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
    const user = new User({
        email: bcrypt.hashSync(req.body.email, 10),
        password: bcrypt.hashSync(req.body.password, 10)
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
    bcrypt.hash(req.body.email, 10)
        .then(email => {
            console.log(email);
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                    }
                    bcrypt.compare(req.body.password, user.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(401).json({ error: 'Mot de passe incorrect !' });
                            }
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            });
                        })
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
