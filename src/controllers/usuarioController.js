const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.perfil = async (req, res) => {
  const usuario = await Usuario.findById(req.session.usuarioId);
  res.render('usuarios/perfil', { title: 'Mi Perfil', usuario, error: null });
};

exports.actualizarPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.session.usuarioId);
  const { nombre, passwordActual, passwordNueva } = req.body;

  if (passwordActual && passwordNueva) {
    const valido = await usuario.compararPassword(passwordActual);
    if (!valido) {
      return res.render('usuarios/perfil', { title: 'Mi Perfil', usuario, error: 'Contraseña actual incorrecta' });
    }
    usuario.password = passwordNueva;
  }
  usuario.nombre = nombre;
  await usuario.save();
  res.render('usuarios/perfil', { title: 'Mi Perfil', usuario, error: 'Perfil actualizado correctamente' });
};

// NUEVO: Mostrar formulario para crear usuario
exports.formNuevoUsuario = (req, res) => {
  res.render('usuarios/nuevo', { title: 'Nuevo Usuario', error: null });
};

// NUEVO: Crear usuario
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