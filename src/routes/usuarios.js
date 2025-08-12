const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { requireLogin } = require('../middlewares/auth');

router.get('/perfil', requireLogin, usuarioController.perfil);
router.post('/perfil', requireLogin, usuarioController.actualizarPerfil);

module.exports = router;