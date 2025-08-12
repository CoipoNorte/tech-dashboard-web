const Categoria = require('../models/Categoria');

exports.listar = async (req, res) => {
  const categorias = await Categoria.find();
  res.render('categorias/index', { title: 'Categorías', categorias });
};

exports.formNuevo = (req, res) => {
  res.render('categorias/form', { title: 'Nueva Categoría', categoria: {}, action: '/categorias', method: 'POST' });
};

exports.crear = async (req, res) => {
  await Categoria.create(req.body);
  res.redirect('/categorias');
};

exports.formEditar = async (req, res) => {
  const categoria = await Categoria.findById(req.params.id);
  res.render('categorias/form', { title: 'Editar Categoría', categoria, action: `/categorias/${categoria._id}`, method: 'POST' });
};

exports.editar = async (req, res) => {
  await Categoria.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/categorias');
};

exports.eliminar = async (req, res) => {
  await Categoria.findByIdAndDelete(req.params.id);
  res.redirect('/categorias');
};