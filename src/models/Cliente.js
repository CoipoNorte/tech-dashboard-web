const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: String,
  email: String,
  direccion: String,
  observaciones: String,
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', clienteSchema);