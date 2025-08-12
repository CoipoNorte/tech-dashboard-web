const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotoController');
const { requireLogin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/:id/fotos', requireLogin, fotoController.gestionarFotos);
router.post('/:id/fotos/subir', requireLogin, upload.array('imagenes'), fotoController.subirFotos);
router.post('/:id/fotos/eliminar', requireLogin, fotoController.eliminarFoto);
router.post('/:id/fotos/renombrar', requireLogin, fotoController.renombrarFoto);
router.post('/:id/fotos/eliminar-carpeta', requireLogin, fotoController.eliminarCarpetaDrive);

module.exports = router;