const Publication = require('../models/Publication');

exports.publicationFindById = async (req, res, next) => {
    try {
        req.publication = await Publication.findOne({
            where: { id: req.params.id }
        });
    } catch (error) {
        res.status(404).json({ error: 'Publication inexistante !' });
    } finally {
        next();
    }
};

exports.canGetPublication = (req, res, next) => {
    if (!req.publication.modere && req.userData.role !== 'MODERATEUR') {
        res.status(401).json({error: 'Consultation non autorisée !'});
    }
    next();
};

exports.canUpdatePublication = (req, res, next) => {
    if (req.publication.utilisateur_id !== req.userData.userId && req.userData.role !== 'MODERATEUR') {
        res.status(401).json({error: 'Mise à jour non autorisée !'});
    }
    next();
};

exports.canDeletePublication = (req, res, next) => {
    if (req.publication.utilisateur_id !== req.userData.userId && req.userData.role !== 'MODERATEUR') {
        res.status(401).json({error: 'Suppression non autorisée !'});
    }
    next();
};

exports.canCommentPublication = (req, res, next) => {
    if (!req.publication.modere && req.publication.utilisateur_id !== req.userData.userId && req.userData.role !== 'MODERATEUR') {
        res.status(401).json({error: 'Commentaire non autorisé !'});
    }
    next();
};

exports.canLikePublication = (req, res, next) => {
    if (!req.publication.modere && req.publication.utilisateur_id !== req.userData.userId && req.userData.role !== 'MODERATEUR') {
        res.status(401).json({error: 'Like non autorisé !'});
    }
    next();
};
