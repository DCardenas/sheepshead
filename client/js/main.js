import Seat from './Seat.js';
import setupSocket from './setup/socket.js';
import setupCanvas from './setup/canvas.js';
import setupComp from './setup/comp.js';

const clients = new Map();
const seats = [];

const NUM_PLAYERS = 5;
for (let i = 0; i < NUM_PLAYERS; i++) {
  seats.push(new Seat(i));
}

let selfID = null;
const socket = setupSocket(clients, selfID);

const {canvas, ctx} = setupCanvas();
const comp = setupComp(
  clients, seats, selfID,
  {bgColor: '#161642', redraw: true},
  {bgColor: 'grey', redraw: true}
);

function loop() {
  comp.game.draw(ctx.game);
  comp.spec.draw(ctx.spec);

  if (selfID) {
    console.log(selfID);
  }

  window.requestAnimationFrame(loop);
}

loop();
