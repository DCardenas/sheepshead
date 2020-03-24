import Button from '../ui/Button.js';
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export function buildPregameUI(socket, settings) {
  const pregame = {
    buttons: []
  }
  const standButton = new Button(
    100, CANVAS_HEIGHT * 0.9, 100, 80, 'Stand', settings.game
  );
  standButton.onclick = () => {
    socket.emit('stand');
  }

  pregame.buttons.push(standButton);

  return pregame
}

export function buildPickingUI(socket, settings) {
  const picking = {
    buttons: []
  }
  const pickButton = new Button(
    100, CANVAS_HEIGHT * 0.9, 100, 80, 'Pick', settings.game
  );
  pickButton.onclick = () => {
    socket.emit('pick');
  }

  const passButton = new Button(
    220, CANVAS_HEIGHT * 0.9, 100, 80, 'Pass', settings.game
  );
  passButton.onclick = () => {
    socket.emit('pass');
  }

  picking.buttons.push(pickButton);
  picking.buttons.push(passButton);

  return picking
}
