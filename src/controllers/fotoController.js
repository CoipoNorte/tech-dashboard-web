const Trabajo = require('../models/Trabajo');
const {
  uploadFileToDriveOAuth,
  createDriveFolder,
  deleteDriveFile,
  renameDriveFile,
  isDriveConnected
} = require('../utils/drive_oauth');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const FOLDER_ID = '1ntyUbr9N-LJsUi5joVfnPYY5USqjbt3G';

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.heic' || ext === '.heif') {
    const newPath = filePath.replace(/\.(heic|heif)$/i, '.jpg');
    await sharp(filePath)
      .jpeg()
      .toFile(newPath);
    fs.unlinkSync(filePath);
    return newPath;
  }
  return filePath;
}

exports.gestionarFotos = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id);
  res.render('trabajos/fotos', { title: 'Gestionar Fotos', trabajo });
};

exports.subirFotos = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id);
  let carpetaDriveId = trabajo.carpetaDriveId;
  if (!carpetaDriveId && isDriveConnected()) {
    const folder = await createDriveFolder(`Trabajo_${trabajo._id}`, FOLDER_ID);
    carpetaDriveId = folder.id;
    await Trabajo.findByIdAndUpdate(trabajo._id, { carpetaDriveId });
  }
  let nuevas = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const processedPath = await processImage(file.path);
      const driveFile = await uploadFileToDriveOAuth(processedPath, file.originalname, carpetaDriveId);
      const directLink = `https://drive.google.com/uc?id=${driveFile.id}`;
      nuevas.push({ url: directLink, nombre: file.originalname, driveId: driveFile.id });
      if (fs.existsSync(processedPath)) {
        fs.unlinkSync(processedPath);
      }
    }
  }
  trabajo.imagenes = trabajo.imagenes.concat(nuevas);
  await trabajo.save();
  res.json({ imagenes: trabajo.imagenes });
};

exports.eliminarFoto = async (req, res) => {
  const { driveId } = req.body;
  if (!driveId) {
    return res.status(400).json({ ok: false, error: 'No se recibió el ID del archivo de Drive.' });
  }
  const trabajo = await Trabajo.findById(req.params.id);
  trabajo.imagenes = trabajo.imagenes.filter(img => img.driveId !== driveId);
  await deleteDriveFile(driveId);
  await trabajo.save();
  res.json({ ok: true });
};

exports.renombrarFoto = async (req, res) => {
  const { driveId, nombre } = req.body;
  const trabajo = await Trabajo.findById(req.params.id);
  const img = trabajo.imagenes.find(img => img.driveId === driveId);
  if (img) {
    await renameDriveFile(driveId, nombre);
    img.nombre = nombre;
    await trabajo.save();
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
};

exports.eliminarCarpetaDrive = async (req, res) => {
  const trabajo = await Trabajo.findById(req.params.id);
  if (trabajo.carpetaDriveId) {
    const oAuth2Client = require('../utils/drive_oauth').getSavedOAuth2Client();
    const drive = require('googleapis').google.drive({ version: 'v3', auth: oAuth2Client });
    await drive.files.delete({ fileId: trabajo.carpetaDriveId });
    trabajo.imagenes = [];
    trabajo.carpetaDriveId = null;
    await trabajo.save();
    return res.json({ ok: true });
  }
  res.json({ ok: false });
};