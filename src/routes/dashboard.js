const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const Trabajo = require('../models/Trabajo');
const Estado = require('../models/Estado');
const { requireLogin } = require('../middlewares/auth');

router.get('/', requireLogin, async (req, res) => {
  const totalClientes = await Cliente.countDocuments();
  const estados = await Estado.find();
  const trabajosPorEstado = {};
  for (const estado of estados) {
    trabajosPorEstado[estado.nombre] = await Trabajo.countDocuments({ estado: estado._id });
  }
  res.render('dashboard', { title: 'Dashboard', totalClientes, trabajosPorEstado, estados });
});

module.exports = router;