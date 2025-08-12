const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.loginForm = (req, res) => res.render('auth/login');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await Usuario.findOne({ username });
  if (!user) return res.render('auth/login', { error: 'Usuario no encontrado' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render('auth/login', { error: 'Contraseña incorrecta' });
  req.session.userId = user._id;
  req.session.user = user;
  res.redirect('/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};