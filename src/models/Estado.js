const mongoose = require('mongoose');

const estadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  color: { type: String, required: true, default: '#6c757d' },
  icono: { type: String, default: 'bi bi-flag' }
});

module.exports = mongoose.model('Estado', estadoSchema);