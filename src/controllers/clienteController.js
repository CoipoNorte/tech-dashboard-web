const Cliente = require('../models/Cliente');
const Trabajo = require('../models/Trabajo');

exports.listar = async (req, res) => {
  const { q } = req.query;
  let clientes;
  if (q) {
    clientes = await Cliente.find({ nombre: { $regex: q, $options: 'i' } });
  } else {
    clientes = await Cliente.find();
  }
  res.render('clientes/index', { title: 'Clientes', clientes, q });
};

exports.formNuevo = (req, res) => {
  res.render('clientes/form', { title: 'Nuevo Cliente', cliente: {}, action: '/clientes', method: 'POST' });
};

exports.crear = async (req, res) => {
  await Cliente.create(req.body);
  res.redirect('/clientes');
};

exports.detalle = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  const trabajos = await Trabajo.find({ cliente: cliente._id })
    .populate('categoria estado urgencia');
  res.render('clientes/detalle', { title: 'Detalle Cliente', cliente, trabajos });
};

exports.formEditar = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  res.render('clientes/form', { title: 'Editar Cliente', cliente, action: `/clientes/${cliente._id}`, method: 'POST' });
};

exports.editar = async (req, res) => {
  await Cliente.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/clientes');
};

exports.eliminar = async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.redirect('/clientes');
};