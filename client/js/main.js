import Seat from './Seat.js';
import setupSocket from './setup/socket.js';
import setupCanvas from './setup/canvas.js';
import setupComp from './setup/comp.js';
import setupMouse from './setup/mouse.js';
import { createObjectForEach } from './utils.js';

const { canvas, ctx } = setupCanvas();
const clients = new Map();

createObjectForEach();

const seats = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null
}

const NUM_PLAYERS = 5;
for (let i = 0; i < NUM_PLAYERS; i++) {
  const seat = new Seat(i);
  seats[i] = seat;
  seat.onclick = btn => {
    if (btn === 1) {
      socket.emit('sit', seat.num);
    }
  }
}

const settings = {
  selfId: null,
  game: {
  bgColor: '#161642', redraw: true
  },
  spec: {
  bgColor: 'grey', redraw: true
  }
}
const socket = setupSocket(clients, seats);
socket.on('init', data => {
  if (data.selfID) {
    settings.selfID = data.selfID;
  }
});

const mouse = setupMouse(canvas, seats);
const comp = setupComp(clients, seats, settings);

function loop() {
  comp.draw(ctx);

  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`(${mouse.x}, ${mouse.y})`, 10, 10);

  window.requestAnimationFrame(loop);
}

loop();
