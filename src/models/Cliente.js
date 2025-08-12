const mongoose = require('mongoose');
const ClienteSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  email: String,
  direccion: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Cliente', ClienteSchema);