const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const utilisateurCtrl = require('../controllers/utilisateur');

router.post('/signup', utilisateurCtrl.signup);
router.post('/login', utilisateurCtrl.login);
router.delete('/:id', auth, utilisateurCtrl.delete);

module.exports = router;
