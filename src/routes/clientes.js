const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Middleware simple de autenticación
function isAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

router.get('/', isAuth, clienteController.listar);
router.get('/nuevo', isAuth, clienteController.formNuevo);
router.post('/nuevo', isAuth, clienteController.crear);
router.get('/editar/:id', isAuth, clienteController.formEditar);
router.post('/editar/:id', isAuth, clienteController.editar);
router.get('/eliminar/:id', isAuth, clienteController.eliminar);
router.get('/detalle/:id', isAuth, clienteController.detalle);

module.exports = router;