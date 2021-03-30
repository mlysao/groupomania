const Commentaire = require('../models/Commentaire');

exports.createCommentaire = (req, res, next) => {
    try {
        const commentaireObject = { ...JSON.parse(req.body.commentaire) };
        Commentaire.create({
            contenu: commentaireObject.contenu,
            publication_id: commentaireObject.publication_id,
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
        const commentaireObject = { ...JSON.parse(req.body.commentaire) };
        if (req.userData.role !== 'MODERATEUR') {
            delete commentaireObject.modere;
        }
        Commentaire.update({ commentaireObject }, {where: { id: req.params.id }})
            .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
            .catch(error => res.status(400).json({ error }));
    } catch (error) {
        return res.status(400).json({ error });
    }
};
