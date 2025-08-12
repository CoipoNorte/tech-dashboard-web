const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { requireLogin } = require('../middlewares/auth');

router.get('/perfil', requireLogin, usuarioController.perfil);
router.post('/perfil', requireLogin, usuarioController.actualizarPerfil);

// NUEVO: Crear usuario
router.get('/nuevo', requireLogin, usuarioController.formNuevoUsuario);
router.post('/nuevo', requireLogin, usuarioController.crearUsuario);

module.exports = router;