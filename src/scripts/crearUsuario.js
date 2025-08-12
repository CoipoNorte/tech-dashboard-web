require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const username = 'admin';
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    await Usuario.create({ username, password: hash });
    console.log('Usuario admin creado');
    process.exit();
  });