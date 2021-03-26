const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const commentaireCtrl = require('../controllers/commentaire');

router.put('/:id', auth, commentaireCtrl.modifyCommentaire);

module.exports = router;
