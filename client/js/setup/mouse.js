import MouseManager from '../input/Mouse.js';
import { collisionPointRect } from '../utils.js';

export default function setupMouse(canvas, seats) {
  const mouse = new MouseManager();
  ['mousemove', 'click'].forEach(type => {
    mouse.listenTo(document, type);
  });
  mouse.addCallback('mousemove', event => {
    mouse.x = event.clientX - canvas.offsetLeft;
    mouse.y = event.clientY - canvas.offsetTop;

    seats.forEach(seat => {
      if (collisionPointRect(mouse, seat.bounds)) {
        mouse.hover = seat;
        seat.redraw = true;
      }
    });
  });

  return mouse;
}
