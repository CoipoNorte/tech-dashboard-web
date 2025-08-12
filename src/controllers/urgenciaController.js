const Urgencia = require('../models/Urgencia');

exports.listar = async (req, res) => {
  const urgencias = await Urgencia.find();
  res.render('urgencias/index', { title: 'Urgencias', urgencias });
};

exports.formNuevo = (req, res) => {
  res.render('urgencias/form', { title: 'Nueva Urgencia', urgencia: {}, action: '/urgencias', method: 'POST' });
};

exports.crear = async (req, res) => {
  await Urgencia.create(req.body);
  res.redirect('/urgencias');
};

exports.formEditar = async (req, res) => {
  const urgencia = await Urgencia.findById(req.params.id);
  res.render('urgencias/form', { title: 'Editar Urgencia', urgencia, action: `/urgencias/${urgencia._id}`, method: 'POST' });
};

exports.editar = async (req, res) => {
  await Urgencia.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/urgencias');
};

exports.eliminar = async (req, res) => {
  await Urgencia.findByIdAndDelete(req.params.id);
  res.redirect('/urgencias');
};