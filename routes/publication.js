const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const publicationCtrl = require('../controllers/publication');
const commentaireCtrl = require('../controllers/commentaire');

router.get('/', auth, publicationCtrl.getAllPublication);
router.get('/:id', auth, publicationCtrl.getOnePublication);
router.post('/', auth, multer, publicationCtrl.createPublication);
router.put('/:id', auth, multer, publicationCtrl.modifyPublication);
router.delete('/:id', auth, publicationCtrl.deletePublication);
router.post('/:id/like', auth, publicationCtrl.likePublication);
router.post('/:id/commentaires', auth, commentaireCtrl.createCommentaire);

module.exports = router;
