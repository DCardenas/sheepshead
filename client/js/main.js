import Seat from './Seat.js';
import setupSocket from './setup/socket.js';
import setupCanvas from './setup/canvas.js';
import setupComp from './setup/comp.js';
import setupMouse from './setup/mouse.js';

const {canvas, ctx} = setupCanvas();
const clients = new Map();
const seats = [];

const NUM_PLAYERS = 5;
for (let i = 0; i < NUM_PLAYERS; i++) {
  seats.push(new Seat(i));
}

const mouse = setupMouse(canvas, seats);

let selfID = null;
const socket = setupSocket(clients, selfID);
socket.on('init', data => {
  if (data.selfID) {
    selfID = data.selfID;
  }
});

const comp = setupComp(
  clients, seats, selfID,
  {
    game: {
    bgColor: '#161642', redraw: true
    },
    spec: {
    bgColor: 'grey', redraw: true
    }
  }
);

function loop() {
  comp.draw(ctx);
  
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`(${mouse.x}, ${mouse.y})`, 10, 10);


  window.requestAnimationFrame(loop);
}

loop();
