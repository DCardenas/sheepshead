const StateManager = require('./StateManager.js');
const State = require('./State.js');
const createPregame = require('./states/pregame.js');

function setupStateManager(gameState) {
  const stateManager = new StateManager();

  const pregame = createPregame();
  const picking = new State('picking');
  const burying = new State('burying');
  const playing = new State('playing');

  picking.enter = gameState => {
    const pack = { game: {} };

    gameState.nextPlayer();
    pack.game.activePlayer = gameState.activePlayer;

    return pack;
  }
  picking.handleEvent('pass', gameState => {

  })
  picking.handleEvent('pick', gameState => {

  });

  [pregame, picking].forEach(state => {
    stateManager.addState(state);
  });
  stateManager.activeState = pregame;
  return stateManager;
}

module.exports = setupStateManager;
