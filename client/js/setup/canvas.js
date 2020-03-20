export default function setupCanvas() {
  const canvas = {
    game: document.getElementById('gameCanvas'),
    spec: document.getElementById('spectatorCanvas')
  }
  canvas.game.width = 900;
  canvas.game.height = 600;
  canvas.spec.width = 240;
  canvas.spec.height = 600;

  const ctx = {
    game: canvas.game.getContext('2d'),
    spec: canvas.spec.getContext('2d')
  }

  return {canvas, ctx};
}
