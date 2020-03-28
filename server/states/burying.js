const State = require('./State.js');

function createBuryingState() {
  const burying = new State('burying');

  burying.enter = gameState => {
    const pack = {
      game: {},
      clients: []
    }

    gameState.picker = gameState.activePlayer;

    pack.clients.push(gameState.getActivePlayer().getUpdatePack(['hand']));

    return pack
  }
  burying.addCallback('cardSelected', (data, gameState) => {
    
  });

  burying.nextState = 'playing';

  return burying
}

module.exports = createBuryingState;
