const SPEC_OFFSET = 910;

export function createSpectatorBGLayer(settings) {
  const buffer = document.createElement('canvas');
  buffer.width = 250;
  buffer.height = 600;

  return function drawSpectatorBGLayer(ctx) {
    if (settings.redraw) {
        const bCtx = buffer.getContext('2d');
        bCtx.fillStyle = settings.bgColor || 'grey';
        bCtx.fillRect(0, 0, buffer.width, buffer.height);
        settings.redraw = false;
    }

    ctx.drawImage(buffer, SPEC_OFFSET, 0);
  }
}

export function createSpectatorLayer(clients) {
  return function drawSpecLayer(ctx) {
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = '20px Arial';
    let i = 0;
    clients.forEach(client => {
      if (client.seat !== null) {
        return
      }

      ctx.fillText(client.name, SPEC_OFFSET + 10, i * 40 + 20);
      i++;
    });
  }
}
