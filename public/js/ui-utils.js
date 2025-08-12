function showLoader(msg) {
  document.getElementById('loaderMsg').textContent = msg || 'Procesando...';
  new bootstrap.Modal(document.getElementById('loaderModal')).show();
}
function hideLoader() {
  var modalEl = document.getElementById('loaderModal');
  var modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}
function showAlert(msg, type='success', id='fotoAlert') {
  var alertDiv = document.getElementById(id);
  if (!alertDiv) return;
  alertDiv.className = 'alert alert-' + type + ' text-center';
  alertDiv.textContent = msg;
  alertDiv.classList.remove('d-none');
  setTimeout(() => { alertDiv.classList.add('d-none'); }, 2000);
}