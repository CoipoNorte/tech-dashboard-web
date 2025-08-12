const Cliente = require('../models/Cliente');
const Trabajo = require('../models/Trabajo');

exports.listar = async (req, res) => {
  const clientes = await Cliente.find().sort({ createdAt: -1 });
  res.render('clientes/index', { clientes });
};

exports.formNuevo = (req, res) => {
  res.render('clientes/form', { cliente: {}, action: '/clientes/nuevo', method: 'POST' });
};

exports.crear = async (req, res) => {
  await Cliente.create(req.body);
  res.redirect('/clientes');
};

exports.formEditar = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  res.render('clientes/form', { cliente, action: `/clientes/editar/${cliente._id}`, method: 'POST' });
};

exports.editar = async (req, res) => {
  await Cliente.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/clientes');
};

exports.eliminar = async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.redirect('/clientes');
};

exports.detalle = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  const trabajos = await Trabajo.find({ cliente: cliente._id });
  res.render('clientes/detalle', { cliente, trabajos });
};