const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export function createGameBGLayer(settings, gameState) {
  const buffer = document.createElement('canvas');
  buffer.width = CANVAS_WIDTH;
  buffer.height = CANVAS_HEIGHT;

  return function drawBGLayer(ctx) {
    if (settings.redraw) {
      const bctx = buffer.getContext('2d');
      bctx.fillStyle = settings.bgColor || 'blue';
      bctx.fillRect(0, 0, buffer.width, buffer.height);

      const ui = gameState.ui.states[gameState.state];
      ui.buttons.forEach(button => {
        if (button.redraw) {
          button.redrawBuffer();
        }
        bctx.drawImage(button.buffer, button.x - button.w / 2, button.y - button.h / 2);
      });

      settings.redraw = false;
    }

    ctx.drawImage(buffer, 0, 0);
  }
}

export function createSeatLayer(clients, seats, settings) {
  return function drawSeatLayer(ctx) {
    let seatNum = 0;

    const self = clients.get(settings.selfID);
    if (self && self.seat) {
      seatNum = self.seat;
    }

    const NUM_PLAYERS = 5;
    for (let i = 0; i < NUM_PLAYERS; i++) {
      const seat = seats[seatNum];

      if (seat.redraw) {
        seat.redrawBuffer();
      }

      ctx.drawImage(seat.buffer, seat.x - seat.w / 2, seat.y - seat.h / 2);

      seatNum += 1;
      seatNum %= NUM_PLAYERS;
    }
  }
}

export function createGameStateLayer(clients, seats, gameState) {
  return function drawGameStateLayer(ctx) {
    if (gameState.dealer !== null) {
      const seat = seats[gameState.dealer];

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(seat.x, seat.y + seat.h / 2, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
}
