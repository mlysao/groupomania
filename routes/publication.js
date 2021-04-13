const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const publicationMiddleWare = require('../middleware/publication');
const publicationCtrl = require('../controllers/publication');

router.get('/', auth, publicationCtrl.getAllPublication);
router.get('/:id', auth, publicationMiddleWare.publicationFindById, publicationMiddleWare.canGetPublication, publicationCtrl.getOnePublication);
router.post('/', auth, multer, publicationCtrl.createPublication);
router.put('/:id', auth, multer, publicationMiddleWare.publicationFindById, publicationMiddleWare.canUpdatePublication, publicationCtrl.modifyPublication);
router.delete('/:id', auth, publicationMiddleWare.publicationFindById, publicationMiddleWare.canDeletePublication, publicationCtrl.deletePublication);
router.post('/:id/like', auth, publicationMiddleWare.publicationFindById, publicationMiddleWare.canLikePublication, publicationCtrl.likePublication);
router.get('/:id/like', auth, publicationMiddleWare.publicationFindById, publicationCtrl.getLikesByPublication);
router.get('/:id/dislike', auth, publicationMiddleWare.publicationFindById, publicationCtrl.getDislikesByPublication);

module.exports = router;
