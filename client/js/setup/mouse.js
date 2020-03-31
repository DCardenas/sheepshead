import MouseManager from '../input/Mouse.js';
import { collisionPointRect } from '../utils.js';

export default function setupMouse(canvas, game, socket) {
  let seats = game.seats;

  const mouse = new MouseManager();
  ['mousemove', 'mousedown', 'mouseup', 'click'].forEach(type => {
    mouse.listenTo(document, type);
  });
  mouse.addCallback('mousemove', event => {
    mouse.pos.x = event.clientX - canvas.offsetLeft;
    mouse.pos.y = event.clientY - canvas.offsetTop;

    // Do not worry about mouse movements if we have something selected
    if (mouse.selection) {
      if (mouse.selection.onmousemove) {
        mouse.selection.onmousemove(mouse.pos, socket);
      }
      return
    }

    if (mouse.hover) {
      if (collisionPointRect(mouse.pos, mouse.hover.bounds)) {
        return
      } else {
        mouse.exit(socket);
      }
    }

    seats.forEach(seat => {
      const hit = seat.checkMouseHover(mouse.pos);

      if (hit.target) {
        mouse.enter(hit.target, socket);
      }
    });

    const ui = game.getUI();

    if (ui) {
      ui.buttons.forEach(button => {
        if (button.active && collisionPointRect(mouse.pos, button.bounds)) {
          mouse.enter(button, socket);
        }
      });
    }
  });

  mouse.addCallback('click', event => {
    if (mouse.hover && mouse.hover.onclick) {
      mouse.hover.onclick(event.which, socket);
    }
  });

  mouse.addCallback('mousedown', event => {
    if (mouse.hover && mouse.hover.onmousedown) {
      const cursor = mouse.hover.onmousedown(event.which, mouse.pos, socket);
      mouse.setCursor(cursor);

      mouse.selection = mouse.hover;
      mouse.selections.set(mouse.hover.id, mouse.hover);
    }
  });

  mouse.addCallback('mouseup', event => {
    if (mouse.selection) {
      const target = null;

      if (mouse.selection.onmouseup) {
        mouse.selection.onmouseup(event.which, target, socket);
      }

      mouse.selection = null;
    }
  });

  return mouse;
}
