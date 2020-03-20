import Compositor from '../Compositor.js';

function createSpectatorBGLayer(settings) {
  const buffer = document.createElement('canvas');
  buffer.width = 240;
  buffer.height = 600;

  return function drawSpectatorBGLayer(ctx) {
    if (settings.redraw) {
        const bCtx = buffer.getContext('2d');
        bCtx.fillStyle = settings.bgColor || 'grey';
        bCtx.fillRect(0, 0, buffer.width, buffer.height);
        settings.redraw = false;
    }

    ctx.drawImage(buffer, 0, 0);
  }
}

function createSpectatorLayer(clients) {
  return function drawSpecLayer(ctx) {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '20px Arial';
    let i = 0;
    clients.forEach(client => {
      if (client.playing) {
        return
      }

      ctx.fillText(client.name, 10, i * 40 + 20);
      i++;
    });
  }
}

export default function createSpectatorCompositor(clients, settings) {
  const comp = new Compositor();

  const specBGLayer = createSpectatorBGLayer(settings);
  const specLayer = createSpectatorLayer(clients);
  [specBGLayer, specLayer].forEach(layer => {
    comp.addLayer(layer);
  });

  return comp;
}
