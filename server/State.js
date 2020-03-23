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

  handleEvent(type, data) {
    if (!this.callbacks.has(type)) {
      return
    }

    this.callbacks.get(type)(data);
  }
}

module.exports = State;
