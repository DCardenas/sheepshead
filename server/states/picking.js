const State = require('./State.js');

function createPickingState() {
  const picking = new State('picking');

  picking.enter = gameState => {
    const pack = {};

    gameState.nextPlayer();
    pack.activePlayer = gameState.activePlayer;

    return pack
  }
  picking.handleEvent('pass', (data, gameState) => {
    const pack = { game: {} }

    gameState.nextPlayer();
    pack.game.activePlayer = gameState.activePlayer;

    return pack
  });
  picking.handleEvent('pick', (data, gameState) => {
    const pack = { game: {}, clients: {} }

    gameState.pick(data.player);

    picking.toExit = true;

    return pack
  });

  picking.nextState = 'burying';

  return picking
}

module.exports = createPickingState;
