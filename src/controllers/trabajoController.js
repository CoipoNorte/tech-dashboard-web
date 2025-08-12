const Trabajo = require('../models/Trabajo');
const Cliente = require('../models/Cliente');

exports.listar = async (req, res) => {
  const trabajos = await Trabajo.find().populate('cliente').sort({ fechaIngreso: -1 });
  res.render('trabajos/index', { trabajos });
};

exports.formNuevo = async (req, res) => {
  const clientes = await Cliente.find();
  res.render('trabajos/form', { trabajo: {}, clientes, action: '/trabajos/nuevo', method: 'POST' });
};

exports.crear = async (req, res) => {
  await Trabajo.create(req.body);
  res.redirect('/trabajos');
};

exports.formEditar = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id);
  const clientes = await Cliente.find();
  res.render('trabajos/form', { trabajo, clientes, action: `/trabajos/editar/${trabajo._id}`, method: 'POST' });
};

exports.editar = async (req, res) => {
  await Trabajo.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/trabajos');
};

exports.eliminar = async (req, res) => {
  await Trabajo.findByIdAndDelete(req.params.id);
  res.redirect('/trabajos');
};