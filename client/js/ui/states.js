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

function buildPregameUI(socket, game) {
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

function buildPickingUI(socket, game) {
  function isActive() {
    // this refers to the button itself
    this.active = true;
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
    socket.emit('userInput', { type: 'pick', data: {} });
  }
  pickButton.determineActive = isActive;

  const passButton = new Button(
    220, CANVAS_HEIGHT * 0.9, 100, 80, 'Pass', game
  );
  passButton.active = false;
  passButton.onclick = () => {
    socket.emit('userInput', { type: 'pass', data: {} });
  }
  passButton.determineActive = isActive;

  picking.buttons.push(standButton);
  picking.buttons.push(pickButton);
  picking.buttons.push(passButton);

  return picking
}

function buildBuryingUI(socket, game) {
  function isActive() {
    // this refers to the button itself
    this.active = true;
  }

  const burying = {
    buttons: []
  }
  burying.update = () => {
    burying.buttons.forEach(button => {
      button.determineActive();
    });
  }

  const standButton = createStandButton(socket, game);

  const buryButton = new Button(
    150, CANVAS_HEIGHT * 0.9, 100, 80, 'Bury', game
  );
  buryButton.active = false;
  buryButton.onclick = () => {
    socket.emit('userInput', { type: 'bury', data: {} });
  }
  buryButton.determineActive = isActive;

  burying.buttons.push(buryButton);

  return burying;
}

export default function buildStatesUI(socket, game) {
  return {
    pregame: buildPregameUI(socket, game),
    picking: buildPickingUI(socket, game),
    burying: buildBuryingUI(socket, game),
  }
}
