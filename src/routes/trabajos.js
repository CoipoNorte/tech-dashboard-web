const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');
const { requireLogin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', requireLogin, trabajoController.listar);
router.get('/nuevo', requireLogin, trabajoController.formNuevo);
router.post('/', requireLogin, upload.array('imagenes'), trabajoController.crear);
router.get('/:id/editar', requireLogin, trabajoController.formEditar);
router.post('/:id', requireLogin, upload.array('imagenes'), trabajoController.editar);
router.post('/:id/eliminar', requireLogin, trabajoController.eliminar);
router.get('/:id', requireLogin, trabajoController.detalle);

// Solo redirige a la gestión de fotos (la lógica está en fotos.js)
router.get('/:id/fotos', requireLogin, require('../controllers/fotoController').gestionarFotos);

module.exports = router;