const Trabajo = require('../models/Trabajo');
const Cliente = require('../models/Cliente');
const Categoria = require('../models/Categoria');
const Estado = require('../models/Estado');
const path = require('path');
const fs = require('fs');

exports.listar = async (req, res) => {
  const { q } = req.query;
  let trabajos;
  if (q) {
    trabajos = await Trabajo.find({ descripcion: { $regex: q, $options: 'i' } }).populate('cliente categoria estado');
  } else {
    trabajos = await Trabajo.find().populate('cliente categoria estado');
  }
  res.render('trabajos/index', { title: 'Trabajos', trabajos, q });
};

exports.formNuevo = async (req, res) => {
  const clientes = await Cliente.find();
  const categorias = await Categoria.find();
  const estados = await Estado.find();
  const clienteId = req.query.cliente;
  res.render('trabajos/form', { title: 'Nuevo Trabajo', trabajo: {}, clientes, categorias, estados, clienteId, action: '/trabajos', method: 'POST' });
};

exports.crear = async (req, res) => {
  const data = req.body;
  if (req.file) data.imagen = req.file.filename;
  await Trabajo.create(data);
  res.redirect('/trabajos');
};

exports.formEditar = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id);
  const clientes = await Cliente.find();
  const categorias = await Categoria.find();
  const estados = await Estado.find();
  res.render('trabajos/form', { title: 'Editar Trabajo', trabajo, clientes, categorias, estados, clienteId: trabajo.cliente, action: `/trabajos/${trabajo._id}`, method: 'POST' });
};

exports.editar = async (req, res) => {
  const data = req.body;
  if (req.file) {
    data.imagen = req.file.filename;
    // Eliminar imagen anterior si existe
    const trabajo = await Trabajo.findById(req.params.id);
    if (trabajo.imagen) {
      fs.unlinkSync(path.join('uploads', trabajo.imagen));
    }
  }
  await Trabajo.findByIdAndUpdate(req.params.id, data);
  res.redirect('/trabajos');
};

exports.eliminar = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id);
  if (trabajo.imagen) {
    fs.unlinkSync(path.join('uploads', trabajo.imagen));
  }
  await Trabajo.findByIdAndDelete(req.params.id);
  res.redirect('/trabajos');
};