import Button from '../ui/Button.js';
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

function createStandButton(socket, game) {
  const standButton = new Button(
    CANVAS_WIDTH - 120, CANVAS_HEIGHT * 0.9, 100, 80, 'Stand', game
  );
  standButton.active = false;
  standButton.onclick = () => {
    socket.emit('userInput', { type: 'stand', data: {} });
  }
  standButton.determineActive = () => {
    let sitting = false;

    game.seats.forEach(seat => {
      if (seat.player && seat.player.isHost) {
        sitting = true;
      }
    });

    standButton.active = sitting;
  }

  return standButton;
}

export function buildPregameUI(socket, game) {
  const pregame = {
    buttons: []
  }
  pregame.update = () => {
    pregame.buttons.forEach(button => {
      button.determineActive();
    });
  }

  const standButton = createStandButton(socket, game);

  pregame.buttons.push(standButton);

  return pregame
}

export function buildPickingUI(socket, game) {
  function isActive() {
    let player = game.getActivePlayer();
    return player && player.isHost;
  }

  const picking = {
    buttons: []
  }
  picking.update = () => {
    picking.buttons.forEach(button => {
      button.determineActive();
    });
  }

  const standButton = createStandButton(socket, game);

  const pickButton = new Button(
    100, CANVAS_HEIGHT * 0.9, 100, 80, 'Pick', game
  );
  pickButton.active = false;
  pickButton.onclick = () => {
    socket.emit('pick');
  }
  pickButton.determineActive = isActive;

  const passButton = new Button(
    220, CANVAS_HEIGHT * 0.9, 100, 80, 'Pass', game
  );
  passButton.active = false;
  passButton.onclick = () => {
    socket.emit('pass');
  }
  passButton.determineActive = isActive;

  picking.buttons.push(standButton);
  picking.buttons.push(pickButton);
  picking.buttons.push(passButton);

  return picking
}
