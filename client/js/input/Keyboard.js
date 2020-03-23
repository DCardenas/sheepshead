export default class KeyboardManager {
  constructor() {
    this.keys = new Map();
    this.callbacks = new Map();
  }

  listenTo(window, type) {
    this.callbacks.set(type, []);

    window.addEventListener(type, event => {
      this.handleEvent(type, event.code);
    });
  }

  addCallback(type, callback) {
    if (!this.callbacks.has(type)) {
      console.log('Not listening for event of type: ' + type);
      return
    }

    this.callbacks.get(type).push(callback);
  }

  handleEvent(type, keyCode) {
    if (!this.callbacks.has(type)) {
      return
    }

    this.callbacks.get(type).forEach(callback => {
      callback(keyCode);
    });
  }
}
