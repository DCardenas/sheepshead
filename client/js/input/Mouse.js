export default class MouseManager {
  constructor() {
    this.pos = {
      x: 0,
      y: 0
    }
    this.hover = null;

    // Local and universal selections
    this.selection = null;
    this.selections = new Map();

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

  enter(obj, socket) {
    this.hover = obj;

    if (obj.onenter) {
      const cursor = obj.onenter(socket);
      this.setCursor(cursor || 'default');
    }

    while (obj.parent) {
      obj = obj.parent;
      obj.redraw = true;
    }

  }

  exit(socket) {
    if (!this.hover) {
      return
    }

    let obj = this.hover;

    if (obj.onexit) {
      obj.onexit(socket);
    }

    while (obj.parent) {
      obj = obj.parent;
    }
    obj.redraw = true;
    this.hover = null;

    this.setCursor('default');
  }
}
