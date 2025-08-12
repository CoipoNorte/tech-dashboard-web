const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.perfil = async (req, res) => {
  const usuario = await Usuario.findById(req.session.usuarioId);
  const usuarios = await Usuario.find();
  res.render('usuarios/perfil', { title: 'Mi Perfil', usuario, usuarios, error: null });
};

exports.actualizarPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.session.usuarioId);
  const { nombre, passwordActual, passwordNueva } = req.body;

  if (passwordActual && passwordNueva) {
    const valido = await usuario.compararPassword(passwordActual);
    if (!valido) {
      const usuarios = await Usuario.find();
      return res.render('usuarios/perfil', { title: 'Mi Perfil', usuario, usuarios, error: 'Contraseña actual incorrecta' });
    }
    usuario.password = passwordNueva;
  }
  usuario.nombre = nombre;
  await usuario.save();
  const usuarios = await Usuario.find();
  res.render('usuarios/perfil', { title: 'Mi Perfil', usuario, usuarios, error: 'Perfil actualizado correctamente' });
};

exports.formNuevoUsuario = (req, res) => {
  res.render('usuarios/nuevo', { title: 'Nuevo Usuario', error: null });
};

exports.crearUsuario = async (req, res) => {
  const { nombre, username, password } = req.body;
  if (!nombre || !username || !password) {
    return res.render('usuarios/nuevo', { title: 'Nuevo Usuario', error: 'Todos los campos son obligatorios' });
  }
  const existe = await Usuario.findOne({ username });
  if (existe) {
    return res.render('usuarios/nuevo', { title: 'Nuevo Usuario', error: 'El usuario ya existe' });
  }
  const usuario = new Usuario({ nombre, username, password });
  await usuario.save();
  res.render('usuarios/nuevo', { title: 'Nuevo Usuario', error: 'Usuario creado correctamente' });
};

exports.formEditarUsuario = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  res.render('usuarios/editar', { title: 'Editar Usuario', usuario, error: null });
};

exports.editarUsuario = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  usuario.nombre = req.body.nombre;
  if (req.body.password && req.body.password.length > 0) {
    usuario.password = req.body.password;
  }
  await usuario.save();
  res.redirect('/usuarios/perfil');
};

exports.eliminarUsuario = async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.redirect('/usuarios/perfil');
};