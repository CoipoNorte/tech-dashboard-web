const express = require('express');
const router = express.Router();
const herramientasController = require('../controllers/herramientasController');
const { requireLogin } = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', requireLogin, herramientasController.vista);
router.get('/exportar', requireLogin, herramientasController.exportar);
router.post('/importar', requireLogin, upload.single('archivo'), herramientasController.importar);
router.post('/vaciar', requireLogin, herramientasController.vaciar);

module.exports = router;