let driveIdAEliminar = null;

function confirmarEliminarImg(driveId) {
  driveIdAEliminar = driveId;
  var modal = new bootstrap.Modal(document.getElementById('modalConfirmarEliminar'));
  modal.show();
}

document.addEventListener('DOMContentLoaded', function() {
  // Eliminar imagen confirmada
  const btnEliminar = document.getElementById('btnEliminarConfirmado');
  if (btnEliminar) {
    btnEliminar.addEventListener('click', function() {
      if (!driveIdAEliminar) return;
      hideConfirmModal();
      showLoader('Eliminando imagen...');
      fetch(window.location.pathname + '/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driveId: driveIdAEliminar })
      })
      .then(res => res.json())
      .then(data => {
        hideLoader();
        if (data.ok) {
          const card = document.getElementById('cardImg' + driveIdAEliminar);
          if (card) card.remove();
          showAlert('Imagen eliminada correctamente.', 'success');
        } else {
          showAlert('Error al eliminar la imagen.', 'danger');
        }
        driveIdAEliminar = null;
      });
    });
  }

  // Subir nuevas imágenes
  const inputFotos = document.getElementById('inputFotos');
  if (inputFotos) {
    inputFotos.addEventListener('change', function() {
      const formData = new FormData();
      for (const file of this.files) {
        formData.append('imagenes', file);
      }
      showLoader('Subiendo imagen(es)...');
      fetch(window.location.pathname + '/subir', {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        hideLoader();
        showAlert('Imagen(es) subida(s) correctamente.', 'success');
        setTimeout(() => { location.reload(); }, 1200);
      });
    });
  }

  // Confirmar eliminación de carpeta
  const btnEliminarCarpeta = document.getElementById('btnEliminarCarpetaConfirmado');
  if (btnEliminarCarpeta) {
    btnEliminarCarpeta.addEventListener('click', function() {
      hideConfirmModalCarpeta();
      showLoader('Eliminando carpeta y fotos...');
      fetch(window.location.pathname + '/eliminar-carpeta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(data => {
        hideLoader();
        if (data.ok) {
          showAlert('Carpeta y fotos eliminadas correctamente.', 'success');
          setTimeout(() => { location.reload(); }, 1200);
        } else {
          showAlert('Error al eliminar la carpeta.', 'danger');
        }
      });
    });
  }
});

function hideConfirmModal() {
  var modalEl = document.getElementById('modalConfirmarEliminar');
  var modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}
function hideConfirmModalCarpeta() {
  var modalEl = document.getElementById('modalConfirmarEliminarCarpeta');
  var modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}
function abrirModalNombre(driveId, nombre) {
  document.getElementById('inputDriveId').value = driveId;
  document.getElementById('inputNuevoNombre').value = nombre || '';
  var modal = new bootstrap.Modal(document.getElementById('modalNombre'));
  modal.show();
}
function aplicarNombre() {
  const driveId = document.getElementById('inputDriveId').value;
  const nombre = document.getElementById('inputNuevoNombre').value;
  showLoader('Renombrando imagen...');
  fetch(window.location.pathname + '/renombrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driveId, nombre })
  })
  .then(res => res.json())
  .then(data => {
    hideLoader();
    if (data.ok) {
      document.getElementById('nombreImg' + driveId).textContent = nombre;
      showAlert('Nombre actualizado.', 'success');
    } else {
      showAlert('Error al renombrar la imagen.', 'danger');
    }
  });
}
function confirmarEliminarCarpeta() {
  var modal = new bootstrap.Modal(document.getElementById('modalConfirmarEliminarCarpeta'));
  modal.show();
}