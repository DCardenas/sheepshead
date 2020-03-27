import MouseManager from '../input/Mouse.js';
import { collisionPointRect } from '../utils.js';

export default function setupMouse(canvas, game, socket) {
  let seats = game.seats;

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
        mouse.exit(socket);
      }
    }

    seats.forEach(seat => {
      const hit = seat.checkMouseHover(mouse);

      if (hit.target) {
        mouse.enter(hit.target, 'pointer', socket);
      }
    });

    game.getUI().buttons.forEach(button => {
      if (collisionPointRect(mouse, button.bounds)) {
        mouse.enter(button, 'pointer', socket);
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
