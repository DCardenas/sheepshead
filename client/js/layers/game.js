const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export function createGameBGLayer(settings) {
  const buffer = document.createElement('canvas');
  buffer.width = CANVAS_WIDTH;
  buffer.height = CANVAS_HEIGHT;

  return function drawBGLayer(ctx) {
    if (settings.redraw) {
      const bctx = buffer.getContext('2d');
      bctx.fillStyle = settings.bgColor || 'blue';
      bctx.fillRect(0, 0, buffer.width, buffer.height);
      settings.redraw = false;
    }

    ctx.drawImage(buffer, 0, 0);
  }
}

export function createSeatLayer(clients, seats, selfID) {
  const seatPos = [
    {x: 0.5, y: 0.90},
    {x: 0.10, y: 0.50},
    {x: 0.33, y: 0.10},
    {x: 0.66, y: 0.10},
    {x: 0.90, y: 0.50},
  ]

  return function drawSeatLayer(ctx) {
    let seatNum = 0;

    const self = clients.get(selfID);
    if (self && self.seat) {
      seatNum = self.seat;
    }

    const NUM_PLAYERS = 5;
    for (let i = 0; i < NUM_PLAYERS; i++) {
      const seat = seats[seatNum];
      const pos = seatPos[seatNum];

      if (seat.redraw) {
        seat.redrawBuffer();
      }

      const x = pos.x * CANVAS_WIDTH - seat.w / 2;
      const y = pos.y * CANVAS_HEIGHT - seat.h / 2;
      seat.x = x;
      seat.y = y;

      if (seat.player) {

      } else {
        ctx.drawImage(seat.buffer, x, y);
      }

      seatNum += 1;
      seatNum %= NUM_PLAYERS;
    }
  }
}
