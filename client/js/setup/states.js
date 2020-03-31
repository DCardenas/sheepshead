import State from '../ui/State.js';
import Button from '../ui/Button.js';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

const BUTTON_WIDTH = 100;
const BUTTON_HEIGHT = CANVAS_HEIGHT * 0.1;

function createStandButton(socket, game, ui) {
  const standButton = new Button(
    CANVAS_WIDTH - 60, BUTTON_HEIGHT / 2, BUTTON_WIDTH, BUTTON_HEIGHT, 'Stand', ui
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

function buildPregameUI(socket, game, ui) {
  const pregame = new State('pregame');

  pregame.enter = () => {
    pregame.buttons.forEach(button => {
      button.determineActive();
    });
  }

  const standButton = createStandButton(socket, game, ui);

  pregame.addButton(standButton);

  return pregame
}

function buildPickingUI(socket, game, ui) {
  function isActive() {
    // this refers to the button itself
    this.active = true;
  }

  const picking = new State('picking');

  picking.enter = () => {
    picking.buttons.forEach(button => {
      button.determineActive();
    });
  }

  const standButton = createStandButton(socket, game, ui);

  const pickButton = new Button(
    10 + BUTTON_WIDTH / 2, BUTTON_HEIGHT / 2, BUTTON_WIDTH, BUTTON_HEIGHT, 'Pick', ui
  );
  pickButton.active = false;
  pickButton.onclick = () => {
    socket.emit('userInput', { type: 'pick', data: {} });
  }
  pickButton.determineActive = isActive;

  const passButton = new Button(
    120 + BUTTON_WIDTH / 2, BUTTON_HEIGHT / 2, BUTTON_WIDTH, BUTTON_HEIGHT, 'Pass', ui
  );
  passButton.active = false;
  passButton.onclick = () => {
    socket.emit('userInput', { type: 'pass', data: {} });
  }
  passButton.determineActive = isActive;

  picking.addButton(standButton);
  picking.addButton(pickButton);
  picking.addButton(passButton);

  return picking
}

function buildBuryingUI(socket, game, ui) {
  function isActive() {
    // this refers to the button itself
    this.active = true;
  }

  const burying = new State('burying');

  burying.enter = () => {
    burying.buttons.forEach(button => {
      button.determineActive();
    });
  }

  const standButton = createStandButton(socket, game, ui);

  const buryButton = new Button(
    60, BUTTON_HEIGHT / 2, BUTTON_WIDTH, BUTTON_HEIGHT, 'Bury', ui
  );
  buryButton.active = false;
  buryButton.onclick = () => {
    socket.emit('userInput', { type: 'bury', data: {} });
  }
  buryButton.determineActive = isActive;

  burying.addButton(standButton);
  burying.addButton(buryButton);

  return burying;
}

export default function buildStatesUI(socket, game, ui) {
  return [
    buildPregameUI(socket, game, ui),
    buildPickingUI(socket, game, ui),
    buildBuryingUI(socket, game, ui),
  ]
}
