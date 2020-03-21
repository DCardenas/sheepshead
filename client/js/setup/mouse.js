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

    if (mouse.hover) {
      if (collisionPointRect(mouse, mouse.hover.bounds)) {
        return
      } else {
        mouse.exit();
      }
    }

    seats.forEach(seat => {
      if (collisionPointRect(mouse, seat.bounds)) {
        mouse.enter(seat, 'pointer');
      }
    });
  });

  mouse.addCallback('click', event => {
    if (mouse.hover && mouse.hover.onclick) {
      mouse.hover.onclick(event.which);
    }
  })

  return mouse;
}
