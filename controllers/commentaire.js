const Commentaire = require('../models/Commentaire');
const Utilisateur = require('../models/Utilisateur');
const {Op} = require("sequelize");

exports.getAllCommentaire = (req, res, next) => {
    let where;
    if (req.userData.role !== 'MODERATEUR') {
        where = {
            publication_id: req.query.publication,
            [Op.or]: [ {modere: true}, {utilisateur_id: req.userData.userId} ]
        };
    } else {
        where = { publication_id: req.query.publication };
        if (req.query.modere) {
            where = { publication_id: req.query.publication, modere: req.query.modere }
        }
    }

    Commentaire.findAll({
        where: where,
        include: [{
            model: Utilisateur,
            attributes: ['id', 'email_display', 'image_url', 'role']
        }],
        order: [
            ['date_publication', 'DESC']
        ],
    })
        .then((commentaires) => res.status(200).json(commentaires))
        .catch(error => res.status(400).json({ error }));
};

exports.createCommentaire = (req, res, next) => {
    try {
        Commentaire.create({
            contenu: req.body.contenu,
            publication_id: req.body.publication_id,
            utilisateur_id: req.userData.userId
        })
            .then(() => res.status(201).json({ message: 'Commentaire enregistré !'}))
            .catch(error => res.status(400).json({ error }));
    } catch (error) {
        return res.status(400).json({ error });
    }
};

exports.modifyCommentaire = (req, res, next) => {
    try {
        Commentaire.update({ modere: true }, {where: { id: req.params.id }})
            .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
            .catch(error => res.status(400).json({ error }));
    } catch (error) {
        return res.status(400).json({ error });
    }
};
