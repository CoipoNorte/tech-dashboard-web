require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const db = require('./src/config/db');

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas
app.use('/', require('./src/routes/auth'));
app.use('/clientes', require('./src/routes/clientes'));
app.use('/trabajos', require('./src/routes/trabajos'));

// Dashboard
const Cliente = require('./src/models/Cliente');
const Trabajo = require('./src/models/Trabajo');

app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const clientesCount = await Cliente.countDocuments();
  const trabajosPendientes = await Trabajo.countDocuments({ estado: { $in: ['Pendiente', 'En Proceso'] } });
  const trabajosListos = await Trabajo.countDocuments({ estado: 'Listo' });
  res.render('dashboard', { 
    user: req.session.user, 
    clientesCount, 
    trabajosPendientes, 
    trabajosListos 
  });
});

// Redirigir raíz a dashboard si está logueado
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));