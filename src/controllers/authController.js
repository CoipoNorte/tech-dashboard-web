const Usuario = require('../models/Usuario');

exports.formLogin = (req, res) => {
  res.render('auth/login', { title: 'Iniciar sesión', error: null });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const usuario = await Usuario.findOne({ username });
  if (!usuario) {
    return res.render('auth/login', { title: 'Iniciar sesión', error: 'Usuario o contraseña incorrectos' });
  }
  const valido = await usuario.compararPassword(password);
  if (!valido) {
    return res.render('auth/login', { title: 'Iniciar sesión', error: 'Usuario o contraseña incorrectos' });
  }
  req.session.usuarioId = usuario._id;
  res.redirect('/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};