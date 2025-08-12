const mongoose = require('mongoose');

const estadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  color: { type: String, required: true, default: '#6c757d' } // gris Bootstrap
});

module.exports = mongoose.model('Estado', estadoSchema);