const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../token.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

function getOAuth2Client() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
}

function getAuthUrl() {
  const oAuth2Client = getOAuth2Client();
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

async function setCredentialsFromCode(code) {
  const oAuth2Client = getOAuth2Client();
  const { tokens } = await oAuth2Client.getToken(code);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

function getSavedOAuth2Client() {
  const oAuth2Client = getOAuth2Client();
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
  }
  return null;
}

function isDriveConnected() {
  return fs.existsSync(TOKEN_PATH);
}

function disconnectDrive() {
  if (fs.existsSync(TOKEN_PATH)) {
    fs.unlinkSync(TOKEN_PATH);
  }
}

async function createDriveFolder(nombre, parentId) {
  const oAuth2Client = getSavedOAuth2Client();
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileMetadata = {
    name: nombre,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId ? [parentId] : undefined
  };
  const folder = await drive.files.create({
    resource: fileMetadata,
    fields: 'id, webViewLink'
  });
  return folder.data;
}

async function uploadFileToDriveOAuth(filePath, fileName, folderId) {
  const oAuth2Client = getSavedOAuth2Client();
  if (!oAuth2Client) throw new Error('No OAuth2 token found. Por favor, conecta Google Drive primero.');
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  const media = {
    mimeType: mime.lookup(filePath) || 'image/jpeg',
    body: fs.createReadStream(filePath),
  };
  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink'
  });
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });
  return response.data;
}

async function deleteDriveFile(fileId) {
  const oAuth2Client = getSavedOAuth2Client();
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  await drive.files.delete({ fileId });
}

async function renameDriveFile(fileId, newName) {
  const oAuth2Client = getSavedOAuth2Client();
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  await drive.files.update({
    fileId,
    resource: { name: newName }
  });
}

module.exports = {
  getAuthUrl,
  setCredentialsFromCode,
  uploadFileToDriveOAuth,
  isDriveConnected,
  disconnectDrive,
  createDriveFolder,
  deleteDriveFile,
  renameDriveFile,
  getSavedOAuth2Client
};