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