const Commentaire = require('../models/Commentaire');

exports.createCommentaire = (req, res, next) => {
    const commentaireObject = req.body.commentaire;
    Commentaire.create({
        contenu: commentaireObject.contenu,
        publication_id: req.params.id,
        utilisateur_id: req.userData.userId,
        modere: false
    })
        .then(() => res.status(201).json({ message: 'Commentaire enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyCommentaire = (req, res, next) => {
    const commentaireObject = req.body.commentaire;
    Commentaire.update({ ...commentaireObject }, {where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
        .catch(error => res.status(400).json({ error }));
};
