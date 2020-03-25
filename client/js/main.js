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
    bgColor: '#161642',
    redraw: true
  },
  spec: {
    bgColor: 'grey',
    redraw: true
  }
}

setupSocket(socket, clients, game);

const keyboard = setupKeyboard(socket);
const mouse = setupMouse(canvas, game);
const comp = setupComp(clients, game, settings);

function loop() {
  comp.draw(ctx);

  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`(${mouse.x}, ${mouse.y})`, 10, 10);

  window.requestAnimationFrame(loop);
}

loop();
