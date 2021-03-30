const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const utilisateurCtrl = require('../controllers/utilisateur');

router.post('/signup', multer, utilisateurCtrl.signup);
router.post('/login', utilisateurCtrl.login);
router.delete('/:id', auth, utilisateurCtrl.delete);

module.exports = router;
