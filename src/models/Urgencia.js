const mongoose = require('mongoose');

const urgenciaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  color: { type: String, required: true, default: '#6c757d' }
});

module.exports = mongoose.model('Urgencia', urgenciaSchema);