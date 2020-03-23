class State {
  constructor(name) {
    this.name = name;
    this.callbacks = new Map();
  }

  enter() {

  }

  exit() {

  }

  addCallback(type, callback) {
    this.callbacks.set(type, callback);
  }

  handleEvent(type, data, gameState) {
    if (!this.callbacks.has(type)) {
      return { error: true, msg: 'Tried to fire event ' + type + ' which has no callbacks.' }
    }

    return this.callbacks.get(type)(data, gameState);
  }
}

module.exports = State;
