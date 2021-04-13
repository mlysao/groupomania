const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const commentaireMiddleware = require('../middleware/commentaire');
const commentaireCtrl = require('../controllers/commentaire');

router.get('/', auth, commentaireCtrl.getAllCommentaire)
router.post('/', auth, multer, commentaireMiddleware.publicationFindById, commentaireMiddleware.canCreateCommentaire, commentaireCtrl.createCommentaire);
router.put('/:id', auth, multer, commentaireMiddleware.publicationFindById, commentaireMiddleware.canModifyCommentaire, commentaireCtrl.modifyCommentaire);

module.exports = router;
