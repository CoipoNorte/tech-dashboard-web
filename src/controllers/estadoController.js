const Estado = require('../models/Estado');

exports.listar = async (req, res) => {
  const estados = await Estado.find();
  res.render('estados/index', { title: 'Estados', estados });
};

exports.formNuevo = (req, res) => {
  res.render('estados/form', { title: 'Nuevo Estado', estado: {}, action: '/estados', method: 'POST' });
};

exports.crear = async (req, res) => {
  await Estado.create(req.body);
  res.redirect('/estados');
};

exports.formEditar = async (req, res) => {
  const estado = await Estado.findById(req.params.id);
  res.render('estados/form', { title: 'Editar Estado', estado, action: `/estados/${estado._id}`, method: 'POST' });
};

exports.editar = async (req, res) => {
  await Estado.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/estados');
};

exports.eliminar = async (req, res) => {
  await Estado.findByIdAndDelete(req.params.id);
  res.redirect('/estados');
};