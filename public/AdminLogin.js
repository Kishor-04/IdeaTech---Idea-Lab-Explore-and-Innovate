function toggleContainer() {
    var container = document.getElementById('container');
    container.classList.toggle('visible');
    var toggleButton = document.getElementById('toggleButton');
    toggleButton.classList.toggle('hidden');
    var overlay = document.getElementById('overlay');
    overlay.style.display = (container.classList.contains('visible')) ? 'block' : 'none';
}
