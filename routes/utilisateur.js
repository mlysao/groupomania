const express = require('express');
const router = express.Router();

const utilisateurCtrl = require('../controllers/utilisateur');

router.post('/signup', utilisateurCtrl.signup);
router.post('/login', utilisateurCtrl.login);
router.delete('/:id', utilisateurCtrl.delete);

module.exports = router;
