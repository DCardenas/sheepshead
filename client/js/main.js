import Seat from './Seat.js';
import setupSocket from './setup/socket.js';
import setupCanvas from './setup/canvas.js';
import setupComp from './setup/comp.js';
import setupMouse from './setup/mouse.js';
import setupKeyboard from './setup/keyboard.js';
import { createObjectForEach } from './utils.js';

const { canvas, ctx } = setupCanvas();
const clients = new Map();

createObjectForEach();

const gameState = {
  state: 'pregame',
  dealer: null,
  activePlayer: null
}
gameState.setState = state => {
  gameState.state = state;
}
const seats = {
  0: null,
  1: null,
  2: null,
  3: null,
  4: null
}
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const seatPos = [
  {x: 0.5, y: 0.85},
  {x: 0.17, y: 0.50},
  {x: 0.30, y: 0.15},
  {x: 0.69, y: 0.15},
  {x: 0.83, y: 0.50},
]
const NUM_PLAYERS = 5;
for (let i = 0; i < NUM_PLAYERS; i++) {
  const seat = new Seat(i);
  const pos = seatPos[i];
  const x = pos.x * CANVAS_WIDTH;
  const y = pos.y * CANVAS_HEIGHT;
  seat.x = x;
  seat.y = y;
  seat.button.onclick = btn => {
    if (btn === 1) {
      socket.emit('userInput', {type: 'sit', data: { seat: seat.num }});
    }
  }

  seats[i] = seat;
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
const socket = setupSocket(clients, seats, gameState);
socket.on('init', data => {
  if (data.selfID) {
    settings.selfID = data.selfID;
  }
});

const keyboard = setupKeyboard(socket);
const mouse = setupMouse(canvas, seats);
const comp = setupComp(clients, seats, settings, gameState);

function loop() {
  comp.draw(ctx);

  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`(${mouse.x}, ${mouse.y})`, 10, 10);

  window.requestAnimationFrame(loop);
}

loop();
