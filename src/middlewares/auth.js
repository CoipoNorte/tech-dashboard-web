exports.requireLogin = (req, res, next) => {
  if (!req.session.usuarioId) {
    return res.redirect('/login');
  }
  next();
};