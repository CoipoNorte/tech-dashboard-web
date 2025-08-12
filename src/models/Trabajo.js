const mongoose = require('mongoose');
const TrabajoSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  descripcion: String,
  estado: { type: String, enum: ['Pendiente', 'En Proceso', 'Listo', 'Entregado'], default: 'Pendiente' },
  precio: Number,
  fechaIngreso: { type: Date, default: Date.now },
  fechaEntrega: Date
});
module.exports = mongoose.model('Trabajo', TrabajoSchema);