require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function crearUsuario() {
  const username = 'admin';
  const password = 'admin123';
  const nombre = 'Administrador';

  const existe = await Usuario.findOne({ username });
  if (existe) {
    console.log('El usuario ya existe');
    process.exit();
  }

  const usuario = new Usuario({ nombre, username, password });
  await usuario.save();
  console.log('Usuario creado:', username);
  process.exit();
}

crearUsuario();