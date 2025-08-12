const mongoose = require('mongoose');

const trabajoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  descripcion: { type: String, required: true },
  observaciones: { type: String },
  precio: { type: Number, default: 0 },
  fechaIngreso: { type: Date, default: Date.now },
  fechaEntrega: Date,
  imagen: String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  estado: { type: mongoose.Schema.Types.ObjectId, ref: 'Estado', required: true },
  urgencia: { type: mongoose.Schema.Types.ObjectId, ref: 'Urgencia', required: true }
});

module.exports = mongoose.model('Trabajo', trabajoSchema);