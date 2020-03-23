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
      callback(updatePack);
    }

    this.activeState = this.getState(name);

    const updatePack = {}
    updatePack.game = this.activeState.enter(gameState);
    callback(updatePack);
  }

  getState(name) {
    return this.states.get(name);
  }

  handleEvent(type, data, gameState, callback) {
    let updatePack = {}

    updatePack = this.activeState.handleEvent(type, data, gameState);

    if (type === 'stand') {
      // Add options for what happens if someone leaves during a game
      // 30 sec buffer to rejoin
      // Allow anyone to take seat
      // Etc
      gameState.stand(data.player.seat);

      if (this.activeState.name !== 'pregame') {
        this.setState('pregame', gameState, callback);
      }

      updatePack.stand = {
        seat: data.player.seat
      }
      callback(updatePack);
      return
    }

    if (this.activeState.toExit) {
      this.setState(this.activeState.nextState, gameState, callback);
      updatePack.state = this.activeState.name;
    }

    callback(updatePack);
    return
  }
}

module.exports = StateManager;
