const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { requireLogin } = require('../middlewares/auth');

router.get('/', requireLogin, categoriaController.listar);
router.get('/nuevo', requireLogin, categoriaController.formNuevo);
router.post('/', requireLogin, categoriaController.crear);
router.get('/:id/editar', requireLogin, categoriaController.formEditar);
router.post('/:id', requireLogin, categoriaController.editar);
router.post('/:id/eliminar', requireLogin, categoriaController.eliminar);

module.exports = router;