class StateManager {
  constructor(gameState) {
    this.activeState = null;
    this.states = new Map();
  }

  addState(state) {
    this.states.set(state.name, state);
  }

  setState(name, gameState) {
    if (this.activeState) {
      this.activeState.exit(gameState);
    }

    this.activeState = this.getState(name);
    this.activeState.enter(gameState);
  }

  getState(name) {
    return this.states.get(name);
  }

  handleEvent(type, gameState, callback) {
    let updatePack = {};

    updatePack = this.activeState.handleEvent(type, gameState);

    if (type === 'stand' && this.activeState.name !== 'pregame') {
      // Add options for what happens if someone leaves during a game
      // 30 sec buffer to rejoin
      // Allow anyone to take seat
      // Etc
      this.setState('pregame');
      return
    }

    if (this.activeState.toExit) {
      this.activeState.exit(gameState);
      this.activeState = this.getState(this.activeState.nextState);
    }
  }
}

module.exports = StateManager;
