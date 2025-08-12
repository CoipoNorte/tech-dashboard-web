const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { requireLogin } = require('../middlewares/auth');

router.get('/', requireLogin, clienteController.listar);
router.get('/nuevo', requireLogin, clienteController.formNuevo);
router.post('/', requireLogin, clienteController.crear);
router.get('/:id', requireLogin, clienteController.detalle);
router.get('/:id/editar', requireLogin, clienteController.formEditar);
router.post('/:id', requireLogin, clienteController.editar);
router.post('/:id/eliminar', requireLogin, clienteController.eliminar);

module.exports = router;