import ClientManager from './client/ClientManager.js';
import Game from './Game.js';

import setupSocket from './setup/socket.js';
import setupCanvas from './setup/canvas.js';
import setupComp from './setup/comp.js';
import setupMouse from './setup/mouse.js';
import setupKeyboard from './setup/keyboard.js';
import { createObjectForEach } from './utils.js';

const socket = io();
createObjectForEach();

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const { canvas, ctx } = setupCanvas();

const game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT, socket);
const clients = new ClientManager();

const settings = {
  game: {
    bgColor: '#161642'
  },
  spec: {
    bgColor: 'grey',
    redraw: true
  }
}

const keyboard = setupKeyboard(socket);
const mouse = setupMouse(canvas, game, socket);
setupSocket(socket, clients, game, mouse);

const comp = setupComp(clients, game, mouse, settings);

function loop() {
  comp.draw(ctx);

  game.seats.forEach(seat => {
    if (seat.player) {
      seat.player.redraw = true;
      seat.redraw = true;
    }
  });

  window.requestAnimationFrame(loop);
}

loop();
