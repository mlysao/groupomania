const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const commentaireMiddleware = require('../middleware/commentaire');
const commentaireCtrl = require('../controllers/commentaire');

router.post('/', auth, commentaireMiddleware.publicationFindById, commentaireMiddleware.canCreateCommentaire, commentaireCtrl.createCommentaire);
router.put('/:id', auth, commentaireMiddleware.publicationFindById, commentaireMiddleware.canModifyCommentaire, commentaireCtrl.modifyCommentaire);

module.exports = router;
