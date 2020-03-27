class StateManager {
  constructor(gameState) {
    this.activeState = null;
    this.states = new Map();
  }

  addState(state) {
    this.states.set(state.name, state);
  }

  setState(name, gameState, callback) {
    if (this.activeState) {
      const updatePack = this.activeState.exit(gameState);
      this.activeState.toExit = false;

      if (updatePack !== null) {
        callback(updatePack);
      }
    }

    this.activeState = this.getState(name);

    const updatePack = this.activeState.enter(gameState);
    updatePack.state = this.activeState.name;
    callback(updatePack);
  }

  getState(name) {
    return this.states.get(name);
  }

  handleEvent(type, data, gameState, callback) {
    let updatePack = {};

    updatePack = this.activeState.handleEvent(type, data, gameState);

    callback(updatePack);

    if (this.activeState.toExit) {
      this.setState(this.activeState.nextState, gameState, callback);
    }
  }
}

module.exports = StateManager;
