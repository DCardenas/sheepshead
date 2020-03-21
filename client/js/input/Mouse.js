export default class MouseManager {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.hover = null;
    this.callbacks = new Map();
  }

  listenTo(element, type) {
    if (!this.callbacks.has(type)) {
      this.callbacks.set(type, []);
    }

    element.addEventListener(type, event => {
      this.handleEvent(type, event);
    });
  }

  addCallback(type, callback) {
    if (!this.callbacks.has(type)) {
      console.log('Trying to add a callback without listening for ' + type);
      return
    }

    this.callbacks.get(type).push(callback);
  }

  handleEvent(type, event) {
    this.callbacks.get(type).forEach(callback => {
      callback(event);
    });
  }
}
