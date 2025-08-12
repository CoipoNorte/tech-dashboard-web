require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
const db = require('./src/config/db');
const Usuario = require('./src/models/Usuario');
const { getAuthUrl, setCredentialsFromCode, isDriveConnected, disconnectDrive } = require('./src/utils/drive_oauth');

const app = express();

// Conexión a la base de datos
db();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CSP para permitir imágenes de Google Drive y otros hosts confiables
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "img-src 'self' https://drive.google.com https://drive.usercontent.google.com data:; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
    "font-src 'self' https://cdn.jsdelivr.net data:; " +
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;"
  );
  next();
});

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Middleware para usuario en todas las vistas
app.use(async (req, res, next) => {
  if (req.session.usuarioId) {
    res.locals.usuario = await Usuario.findById(req.session.usuarioId);
  } else {
    res.locals.usuario = null;
  }
  res.locals.tokenExists = isDriveConnected();
  next();
});

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas de autenticación Google Drive OAuth2
app.get('/auth/google', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('No code provided');
  await setCredentialsFromCode(code);
  res.render('oauth2success', { title: 'Google Drive conectado' });
});

// Desconectar Google Drive (solo responde 200, el frontend redirige)
app.get('/disconnect-drive', (req, res) => {
  disconnectDrive();
  res.status(200).end();
});

// Dashboard con tokenExists para mostrar el botón de conectar/desconectar Drive
app.get('/dashboard', require('./src/middlewares/auth').requireLogin, async (req, res) => {
  const Cliente = require('./src/models/Cliente');
  const Trabajo = require('./src/models/Trabajo');
  const Estado = require('./src/models/Estado');
  const Categoria = require('./src/models/Categoria');

  const totalClientes = await Cliente.countDocuments();
  const estados = await Estado.find();
  const categorias = await Categoria.find();
  const trabajosPorEstado = {};
  for (const estado of estados) {
    trabajosPorEstado[estado.nombre] = await Trabajo.countDocuments({ estado: estado._id });
  }
  const tokenExists = isDriveConnected();
  res.render('dashboard', { title: 'Dashboard', totalClientes, trabajosPorEstado, estados, categorias, tokenExists });
});

// Rutas principales
app.use('/', require('./src/routes/auth'));
app.use('/clientes', require('./src/routes/clientes'));
app.use('/trabajos', require('./src/routes/trabajos'));
app.use('/trabajos', require('./src/routes/fotos'));
app.use('/categorias', require('./src/routes/categorias'));
app.use('/estados', require('./src/routes/estados'));
app.use('/usuarios', require('./src/routes/usuarios'));
app.use('/urgencias', require('./src/routes/urgencias'));
app.use('/herramientas', require('./src/routes/herramientas'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});