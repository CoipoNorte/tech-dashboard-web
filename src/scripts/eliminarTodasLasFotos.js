const mongoose = require('mongoose');
const Trabajo = require('../models/Trabajo');
require('dotenv').config();

async function eliminarTodasLasFotos() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Trabajo.updateMany({}, { $set: { imagenes: [] } });
  console.log(`Fotos eliminadas de ${result.modifiedCount || result.nModified} trabajos.`);
  mongoose.disconnect();
}

eliminarTodasLasFotos();