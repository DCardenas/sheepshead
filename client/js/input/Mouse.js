export default class MouseManager {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.hover = null;
    this.callbacks = new Map();
  }

  setCursor(type) {
    document.body.style.cursor = type;
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

  enter(obj, cursor) {
    this.hover = obj;
    obj.hover = true;

    while (obj.parent) {
      obj = obj.parent;
      obj.redraw = true;
    }

    this.setCursor(cursor || 'default');
  }

  exit() {
    if (!this.hover) {
      return
    }

    let obj = this.hover;
    obj.hover = false;

    while (obj.parent) {
      obj = obj.parent;
    }
    obj.redraw = true;
    this.hover = null;

    this.setCursor('default');
  }
}
