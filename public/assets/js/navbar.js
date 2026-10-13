function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('show');
  } else {
    sidebar.classList.toggle('hidden');
  }
}

// Ajustar automáticamente el layout al cargar y al redimensionar
function ajustarLayout() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth > 768) {
    sidebar.classList.remove('show');
    sidebar.classList.remove('hidden');
  }
}

window.addEventListener('resize', ajustarLayout);
window.addEventListener('load', ajustarLayout);
