const Trabajo = require('../models/Trabajo');
const Cliente = require('../models/Cliente');
const Categoria = require('../models/Categoria');
const Estado = require('../models/Estado');
const Urgencia = require('../models/Urgencia');

function toInputDate(date) {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function fixDateFromInput(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + 'T12:00:00');
}

exports.listar = async (req, res) => {
  const { q, estado, categoria, urgencia, orden, fechaInicio, fechaFin } = req.query;
  let filtro = {};

  if (q) {
    const clientes = await Cliente.find({ nombre: { $regex: q, $options: 'i' } });
    const clientesIds = clientes.map(c => c._id);
    filtro.$or = [
      { descripcion: { $regex: q, $options: 'i' } },
      { cliente: { $in: clientesIds } }
    ];
  }
  if (estado) filtro.estado = estado;
  if (categoria) filtro.categoria = categoria;
  if (urgencia) filtro.urgencia = urgencia;
  if (fechaInicio || fechaFin) {
    filtro.fechaIngreso = {};
    if (fechaInicio) filtro.fechaIngreso.$gte = new Date(fechaInicio + 'T12:00:00');
    if (fechaFin) filtro.fechaIngreso.$lte = new Date(fechaFin + 'T12:00:00');
  }

  let sort = {};
  if (orden === 'precio_asc') sort.precio = 1;
  if (orden === 'precio_desc') sort.precio = -1;
  if (orden === 'fechaIngreso_asc') sort.fechaIngreso = 1;
  if (orden === 'fechaIngreso_desc') sort.fechaIngreso = -1;
  if (orden === 'fechaEntrega_asc') sort.fechaEntrega = 1;
  if (orden === 'fechaEntrega_desc') sort.fechaEntrega = -1;

  const trabajos = await Trabajo.find(filtro)
    .populate('cliente categoria estado urgencia')
    .sort(sort);

  const estados = await Estado.find();
  const categorias = await Categoria.find();
  const urgencias = await Urgencia.find();

  res.render('trabajos/index', { title: 'Trabajos', trabajos, q, estados, categorias, urgencias, req });
};

exports.formNuevo = async (req, res) => {
  const clientes = await Cliente.find();
  const categorias = await Categoria.find();
  const estados = await Estado.find();
  const urgencias = await Urgencia.find();
  const clienteId = req.query.cliente;
  res.render('trabajos/form', {
    title: 'Nuevo Trabajo',
    trabajo: { fechaIngresoInput: '', fechaEntregaInput: '', imagenes: [] },
    clientes, categorias, estados, urgencias, clienteId,
    action: '/trabajos',
    method: 'POST'
  });
};

exports.crear = async (req, res) => {
  const data = req.body;
  data.imagenes = [];
  data.fechaIngreso = fixDateFromInput(data.fechaIngreso);
  data.fechaEntrega = fixDateFromInput(data.fechaEntrega);
  await Trabajo.create(data);
  res.redirect('/trabajos');
};

exports.formEditar = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id).populate('urgencia');
  const clientes = await Cliente.find();
  const categorias = await Categoria.find();
  const estados = await Estado.find();
  const urgencias = await Urgencia.find();

  res.render('trabajos/form', {
    title: 'Editar Trabajo',
    trabajo: {
      ...trabajo.toObject(),
      fechaIngresoInput: toInputDate(trabajo.fechaIngreso),
      fechaEntregaInput: toInputDate(trabajo.fechaEntrega)
    },
    clientes, categorias, estados, urgencias,
    clienteId: trabajo.cliente,
    action: `/trabajos/${trabajo._id}`,
    method: 'POST'
  });
};

exports.editar = async (req, res) => {
  const data = req.body;
  data.fechaIngreso = fixDateFromInput(data.fechaIngreso);
  data.fechaEntrega = fixDateFromInput(data.fechaEntrega);
  await Trabajo.findByIdAndUpdate(req.params.id, data);
  res.redirect('/trabajos');
};

exports.eliminar = async (req, res) => {
  await Trabajo.findByIdAndDelete(req.params.id);
  res.redirect('/trabajos');
};

exports.detalle = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id)
    .populate('cliente categoria estado urgencia');
  res.render('trabajos/detalle', { title: 'Detalle de Trabajo', trabajo });
};