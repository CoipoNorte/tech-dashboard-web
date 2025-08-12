require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const db = require('./src/config/db');
const Usuario = require('./src/models/Usuario');

const app = express();

// Conexión a la base de datos
db();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día
}));

// Middleware para usuario en todas las vistas
app.use(async (req, res, next) => {
  if (req.session.usuarioId) {
    res.locals.usuario = await Usuario.findById(req.session.usuarioId);
  } else {
    res.locals.usuario = null;
  }
  next();
});

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas
app.use('/', require('./src/routes/auth'));
app.use('/dashboard', require('./src/routes/dashboard'));
app.use('/clientes', require('./src/routes/clientes'));
app.use('/trabajos', require('./src/routes/trabajos'));
app.use('/categorias', require('./src/routes/categorias'));
app.use('/estados', require('./src/routes/estados'));
app.use('/usuarios', require('./src/routes/usuarios'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});