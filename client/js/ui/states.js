import State from './State.js';
import Button from './Button.js';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

const BUTTON_WIDTH = 100;
const BUTTON_HEIGHT = CANVAS_HEIGHT * 0.1;

function createStandButton(socket, game) {
  const standButton = new Button(
    CANVAS_WIDTH - 120, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 'Stand', game.ui
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

function buildPregameUI(socket, game) {
  const pregame = new State('pregame');

  pregame.enter = () => {
    pregame.buttons.forEach(button => {
      button.determineActive();
    });
  }

  const standButton = createStandButton(socket, game);

  pregame.addButton(standButton);

  return pregame
}

function buildPickingUI(socket, game) {
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

  const standButton = createStandButton(socket, game);

  const pickButton = new Button(
    2, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 'Pick', game.ui
  );
  pickButton.active = false;
  pickButton.onclick = () => {
    socket.emit('userInput', { type: 'pick', data: {} });
  }
  pickButton.determineActive = isActive;

  const passButton = new Button(
    130, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 'Pass', game.ui
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

function buildBuryingUI(socket, game) {
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

  const standButton = createStandButton(socket, game);

  const buryButton = new Button(
    20, 0, BUTTON_WIDTH, BUTTON_HEIGHT, 'Bury', game.ui
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

export default function buildStatesUI(socket, game) {
  return [
    buildPregameUI(socket, game),
    buildPickingUI(socket, game),
    buildBuryingUI(socket, game),
  ]
}
