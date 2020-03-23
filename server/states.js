const StateManager = require('./StateManager.js');
const State = require('./states/State.js');
const createPregameState = require('./states/pregame.js');
const createPickingState = require('./states/picking.js');

function setupStateManager(gameState) {
  const stateManager = new StateManager();

  const pregame = createPregameState();
  const picking = createPickingState();
  const burying = new State('burying');
  const playing = new State('playing');
  const paused = new State('paused');

  [pregame, picking, burying, playing, paused].forEach(state => {
    stateManager.addState(state);
  });
  stateManager.activeState = pregame;
  return stateManager;
}

module.exports = setupStateManager;
