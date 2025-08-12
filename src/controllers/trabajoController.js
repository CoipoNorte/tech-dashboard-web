const Trabajo = require('../models/Trabajo');
const Cliente = require('../models/Cliente');
const Categoria = require('../models/Categoria');
const Estado = require('../models/Estado');
const path = require('path');
const fs = require('fs');

exports.listar = async (req, res) => {
  const { q, estado, categoria, orden, fechaInicio, fechaFin } = req.query;
  let filtro = {};
  if (q) filtro.descripcion = { $regex: q, $options: 'i' };
  if (estado) filtro.estado = estado;
  if (categoria) filtro.categoria = categoria;

  // Filtro por rango de fechas
  if (fechaInicio || fechaFin) {
    filtro.fechaIngreso = {};
    if (fechaInicio) filtro.fechaIngreso.$gte = new Date(fechaInicio);
    if (fechaFin) filtro.fechaIngreso.$lte = new Date(fechaFin);
  }

  let sort = {};
  if (orden === 'precio_asc') sort.precio = 1;
  if (orden === 'precio_desc') sort.precio = -1;
  if (orden === 'fechaIngreso_asc') sort.fechaIngreso = 1;
  if (orden === 'fechaIngreso_desc') sort.fechaIngreso = -1;
  if (orden === 'fechaEntrega_asc') sort.fechaEntrega = 1;
  if (orden === 'fechaEntrega_desc') sort.fechaEntrega = -1;

  const trabajos = await Trabajo.find(filtro)
    .populate('cliente categoria estado')
    .sort(sort);

  const estados = await Estado.find();
  const categorias = await Categoria.find();

  res.render('trabajos/index', { title: 'Trabajos', trabajos, q, estados, categorias, req });
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

// NUEVO: Detalle de trabajo
exports.detalle = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id)
    .populate('cliente categoria estado');
  res.render('trabajos/detalle', { title: 'Detalle de Trabajo', trabajo });
};