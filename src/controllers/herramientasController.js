const Cliente = require('../models/Cliente');
const Trabajo = require('../models/Trabajo');
const { Parser } = require('json2csv');
const XLSX = require('xlsx');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

exports.vista = async (req, res) => {
  let dbStats = null;
  try {
    dbStats = await mongoose.connection.db.stats();
  } catch (e) { }
  res.render('herramientas', { title: 'Herramientas', dbStats });
};

exports.exportar = async (req, res) => {
  const tipo = req.query.tipo || 'csv';
  const clientes = await Cliente.find().lean();
  const trabajos = await Trabajo.find().populate('cliente categoria estado urgencia').lean();

  if (tipo === 'excel') {
    const wb = XLSX.utils.book_new();
    const wsClientes = XLSX.utils.json_to_sheet(clientes);
    const wsTrabajos = XLSX.utils.json_to_sheet(trabajos.map(t => ({
      ...t,
      cliente: t.cliente && t.cliente.nombre,
      categoria: t.categoria && t.categoria.nombre,
      estado: t.estado && t.estado.nombre,
      urgencia: t.urgencia && t.urgencia.nombre
    })));
    XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');
    XLSX.utils.book_append_sheet(wb, wsTrabajos, 'Trabajos');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename=datos.jp.xlsx');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  } else {
    // CSV: exportar dos archivos y comprimir en ZIP
    const parserClientes = new Parser({
      fields: clientes.length ? Object.keys(clientes[0]) : ['_id', 'nombre', 'telefono', 'email', 'direccion', 'observaciones', 'fechaCreacion']
    });
    const parserTrabajos = new Parser({
      fields: trabajos.length ? Object.keys(trabajos[0]) : ['_id', 'cliente', 'descripcion', 'observaciones', 'precio', 'fechaIngreso', 'fechaEntrega', 'imagenes', 'carpetaDriveId', 'categoria', 'estado', 'urgencia']
    });
    const csvClientes = parserClientes.parse(clientes);
    const csvTrabajos = parserTrabajos.parse(trabajos.map(t => ({
      ...t,
      cliente: t.cliente && t.cliente.nombre,
      categoria: t.categoria && t.categoria.nombre,
      estado: t.estado && t.estado.nombre,
      urgencia: t.urgencia && t.urgencia.nombre
    })));

    res.setHeader('Content-Disposition', 'attachment; filename=datos.jp.zip');
    res.type('application/zip');
    const archive = archiver('zip');
    archive.pipe(res);
    archive.append(csvClientes, { name: 'clientes.csv' });
    archive.append(csvTrabajos, { name: 'trabajos.csv' });
    archive.finalize();
  }
};

exports.importar = async (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, msg: 'No se subió archivo.' });
  const ext = path.extname(req.file.originalname).toLowerCase();
  const tipo = req.body.tipo; // 'clientes', 'trabajos', 'ambos'
  let clientes = [], trabajos = [];
  try {
    const XLSX = require('xlsx');
    if (ext === '.xlsx' || ext === '.xls') {
      const wb = XLSX.readFile(req.file.path);
      if (tipo === 'clientes' || tipo === 'ambos') {
        clientes = XLSX.utils.sheet_to_json(wb.Sheets['Clientes'] || wb.Sheets[wb.SheetNames[0]]);
      }
      if (tipo === 'trabajos' || tipo === 'ambos') {
        trabajos = XLSX.utils.sheet_to_json(wb.Sheets['Trabajos'] || wb.Sheets[wb.SheetNames[1]]);
      }
    } else if (ext === '.csv' || ext === '.zip') {
      if (ext === '.zip') {
        const AdmZip = require('adm-zip');
        const zip = new AdmZip(req.file.path);
        const entries = zip.getEntries();
        entries.forEach(entry => {
          if (entry.entryName === 'clientes.csv' && (tipo === 'clientes' || tipo === 'ambos')) {
            const csv = entry.getData().toString('utf8');
            clientes = XLSX.utils.sheet_to_json(XLSX.utils.csv_to_sheet(csv));
          }
          if (entry.entryName === 'trabajos.csv' && (tipo === 'trabajos' || tipo === 'ambos')) {
            const csv = entry.getData().toString('utf8');
            trabajos = XLSX.utils.sheet_to_json(XLSX.utils.csv_to_sheet(csv));
          }
        });
      } else {
        const content = fs.readFileSync(req.file.path, 'utf8');
        if (tipo === 'clientes') {
          const wb = XLSX.read(content, { type: 'string' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          clientes = XLSX.utils.sheet_to_json(ws);
        } else if (tipo === 'trabajos') {
          const wb = XLSX.read(content, { type: 'string' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          trabajos = XLSX.utils.sheet_to_json(ws);
        }
      }
    }

    // 1. Importa clientes primero
    if (clientes.length && (tipo === 'clientes' || tipo === 'ambos')) {
      await Cliente.deleteMany({});
      await Cliente.insertMany(clientes);
    }

    // 2. Luego importa trabajos, asociando por nombre de cliente
    if (trabajos.length && (tipo === 'trabajos' || tipo === 'ambos')) {
      const clientesDB = await Cliente.find().lean();
      const categoriasDB = await require('../models/Categoria').find().lean();
      const estadosDB = await require('../models/Estado').find().lean();
      const urgenciasDB = await require('../models/Urgencia').find().lean();

      trabajos = trabajos.map(t => {
        // Convierte el campo imagenes de string a array si es necesario
        if (typeof t.imagenes === 'string') {
          try {
            t.imagenes = JSON.parse(t.imagenes);
            if (!Array.isArray(t.imagenes)) t.imagenes = [];
          } catch (e) {
            t.imagenes = [];
          }
        }
        // Asocia los ObjectId por nombre
        const clienteObj = clientesDB.find(c => c.nombre === t.cliente);
        const categoriaObj = categoriasDB.find(c => c.nombre === t.categoria);
        const estadoObj = estadosDB.find(e => e.nombre === t.estado);
        const urgenciaObj = urgenciasDB.find(u => u.nombre === t.urgencia);

        return {
          ...t,
          cliente: clienteObj ? clienteObj._id : undefined,
          categoria: categoriaObj ? categoriaObj._id : undefined,
          estado: estadoObj ? estadoObj._id : undefined,
          urgencia: urgenciaObj ? urgenciaObj._id : undefined
        };
      });

      await Trabajo.deleteMany({});
      await Trabajo.insertMany(trabajos);
    }

    fs.unlinkSync(req.file.path);
    return res.json({ ok: true });
  } catch (e) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ ok: false, msg: 'Error al importar: ' + e.message });
  }
};

exports.vaciar = async (req, res) => {
  const tipo = req.body.tipo; // 'clientes', 'trabajos', 'ambos'
  if (tipo === 'clientes') {
    await Cliente.deleteMany({});
    return res.json({ ok: true });
  }
  if (tipo === 'trabajos') {
    await Trabajo.deleteMany({});
    return res.json({ ok: true });
  }
  // ambos
  await Cliente.deleteMany({});
  await Trabajo.deleteMany({});
  return res.json({ ok: true });
};