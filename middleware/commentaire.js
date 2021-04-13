const Publication = require('../models/Publication');

exports.publicationFindById = async (req, res, next) => {
    try {
        req.publication = await Publication.findOne({
            where: { id: req.body.publication_id }
        });
    } catch (error) {
        res.status(404).json({ error: 'Publication inexistante !' });
    } finally {
        next();
    }
};

exports.canCreateCommentaire = (req, res, next) => {
    if (!req.publication.modere && req.userData.role !== 'MODERATEUR') {
        res.status(401).json({error: 'Commentaire non autorisé !'});
    }
    next();
};

exports.canModifyCommentaire = (req, res, next) => {
    if (req.publication.utilisateur_id !== req.userData.userId && req.userData.role !== 'MODERATEUR') {
        res.status(401).json({error: 'Mise à jour commentaire non autorisée !'});
    }
    next();
};
