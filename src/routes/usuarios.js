const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { requireLogin } = require('../middlewares/auth');

router.get('/perfil', requireLogin, usuarioController.perfil);
router.post('/perfil', requireLogin, usuarioController.actualizarPerfil);

router.get('/nuevo', requireLogin, usuarioController.formNuevoUsuario);
router.post('/nuevo', requireLogin, usuarioController.crearUsuario);

router.get('/:id/editar', requireLogin, usuarioController.formEditarUsuario);
router.post('/:id/editar', requireLogin, usuarioController.editarUsuario);
router.post('/:id/eliminar', requireLogin, usuarioController.eliminarUsuario);

module.exports = router;