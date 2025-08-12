const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');

function isAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

router.get('/', isAuth, trabajoController.listar);
router.get('/nuevo', isAuth, trabajoController.formNuevo);
router.post('/nuevo', isAuth, trabajoController.crear);
router.get('/editar/:id', isAuth, trabajoController.formEditar);
router.post('/editar/:id', isAuth, trabajoController.editar);
router.get('/eliminar/:id', isAuth, trabajoController.eliminar);

module.exports = router;