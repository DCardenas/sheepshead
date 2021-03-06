const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export function createGameBGLayer(settings, game) {
  const buffer = document.createElement('canvas');
  buffer.width = CANVAS_WIDTH;
  buffer.height = CANVAS_HEIGHT;

  return function drawBGLayer(ctx) {
    if (game.redraw || game.ui.redraw) {
      const bctx = buffer.getContext('2d');
      bctx.fillStyle = settings.bgColor || 'blue';
      bctx.fillRect(0, 0, buffer.width, buffer.height);

      const ui = game.ui;

      ui.redrawBuffer();

      bctx.drawImage(ui.buffer, ui.x - ui.w / 2, ui.y - ui.h / 2);

      game.ui.redraw = false;
      game.redraw = false;
    }

    ctx.drawImage(buffer, 0, 0);
  }
}

export function createSeatLayer(clients, seats, settings) {
  return function drawSeatLayer(ctx) {
    let seatNum = 0;

    const self = clients.localClient;
    if (self && self.seat) {
      seatNum = self.seat;
    }

    const NUM_PLAYERS = 5;
    for (let i = 0; i < NUM_PLAYERS; i++) {
      const seat = seats[seatNum];

      if (seat.shouldRedraw()) {
        seat.redrawBuffer();
      }

      ctx.drawImage(seat.buffer, seat.x - seat.w / 2, seat.y - seat.h / 2);

      seatNum += 1;
      seatNum %= NUM_PLAYERS;
    }
  }
}

export function createGameStateLayer(clients, game) {
  let seats = game.seats;

  return function drawGameStateLayer(ctx) {
    if (game.dealer !== null) {
      const seat = seats[game.dealer];

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(seat.x, seat.y + seat.h / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
}

export function createMouseLayer(mouse) {
  return function drawMouseLayer(ctx) {
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`(${mouse.pos.x}, ${mouse.pos.y})`, 10, 10);

    mouse.selections.forEach(selection => {
      ctx.drawImage(
        selection.buffer,
        selection.x - selection.w / 2, selection.y - selection.h / 2
      );
    });
  }
}
