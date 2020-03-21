export default function setupCanvas() {
  const canvas = document.getElementById('gameCanvas');

  canvas.width = 1200;
  canvas.height = 600;

  const ctx = canvas.getContext('2d');

  return {canvas, ctx};
}
