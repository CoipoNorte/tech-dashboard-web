const express = require('express');
const router = express.Router();
const estadoController = require('../controllers/estadoController');
const { requireLogin } = require('../middlewares/auth');

router.get('/', requireLogin, estadoController.listar);
router.get('/nuevo', requireLogin, estadoController.formNuevo);
router.post('/', requireLogin, estadoController.crear);
router.get('/:id/editar', requireLogin, estadoController.formEditar);
router.post('/:id', requireLogin, estadoController.editar);
router.post('/:id/eliminar', requireLogin, estadoController.eliminar);

module.exports = router;