const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const publicationCtrl = require('../controllers/publication');

router.get('/', auth, publicationCtrl.getAllPublication);
router.get('/:id', auth, publicationCtrl.getOnePublication);
router.post('/', auth, multer, publicationCtrl.createPublication);
router.put('/:id', auth, multer, publicationCtrl.modifyPublication);
router.delete('/:id', auth, publicationCtrl.deletePublication);
router.post('/:id/like', publicationCtrl.likePublication);

module.exports = router;
