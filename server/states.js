const StateManager = require('./StateManager.js');
const State = require('./State.js');

function setupStateManager(gameState) {
  const stateManager = new StateManager();

  const pregame = new State('pregame');
  const picking = new State('picking');
  const burying = new State('burying');
  const playing = new State('playing');

  pregame.enter = gameState => {
    if (gameState.curPlayers !== 0) {
      let dealerFound = false;
      gameState.forEachSeat((player, i) => {
        if (!dealerFound && player) {
          gameState.dealer = i;
          player.dealer = true;
          dealerFound = true;
        }
      });
    }
  }
  pregame.handleEvent('sit', {gameState, seat} => {
    if (gameState.curPlayers === gameState.maxPlayers) {
      pregame.toExit = true;
    } else if (gameState.curPlayers === 1) {
      gameState.dealer = seat;
      gameState.seats[seat].dealer = true;
    }
  });
  pregame.nextState = 'picking';

  picking.handleEvent('pick', gameState => {

  });
}

module.exports = setupStateManager;
