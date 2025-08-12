const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');
const { requireLogin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', requireLogin, trabajoController.listar);
router.get('/nuevo', requireLogin, trabajoController.formNuevo);
router.post('/', requireLogin, upload.single('imagen'), trabajoController.crear);
router.get('/:id/editar', requireLogin, trabajoController.formEditar);
router.post('/:id', requireLogin, upload.single('imagen'), trabajoController.editar);
router.post('/:id/eliminar', requireLogin, trabajoController.eliminar);

module.exports = router;