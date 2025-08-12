const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  icono: { type: String, default: 'bi bi-tag' }
});

module.exports = mongoose.model('Categoria', categoriaSchema);