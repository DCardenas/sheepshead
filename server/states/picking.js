const State = require('./State.js');

function createPickingState() {
  const picking = new State('picking');

  picking.enter = gameState => {
    const pack = {
      clients: [],
      game: {}
    }

    gameState.deal();

    gameState.forEachSeat(player => {
      pack.clients.push(player.getUpdatePack(['hand']));
    });

    gameState.nextPlayer();
    pack.game.activePlayer = gameState.activePlayer;

    return pack
  }
  picking.addCallback('pass', (data, gameState) => {
    const pack = { game: {} }

    gameState.nextPlayer();
    pack.game.activePlayer = gameState.activePlayer;

    return pack
  });
  picking.addCallback('pick', (data, gameState) => {
    const pack = { game: {}, clients: [] }

    if (gameState.pick(data.player)) {
      picking.toExit = true;
    }

    return pack
  });

  picking.nextState = 'burying';

  return picking
}

module.exports = createPickingState;
