const express = require('express');
const router = express.Router();
const urgenciaController = require('../controllers/urgenciaController');
const { requireLogin } = require('../middlewares/auth');

router.get('/', requireLogin, urgenciaController.listar);
router.get('/nuevo', requireLogin, urgenciaController.formNuevo);
router.post('/', requireLogin, urgenciaController.crear);
router.get('/:id/editar', requireLogin, urgenciaController.formEditar);
router.post('/:id', requireLogin, urgenciaController.editar);
router.post('/:id/eliminar', requireLogin, urgenciaController.eliminar);

module.exports = router;