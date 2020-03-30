export default class State {
  constructor(name) {
    this.name = name;
    this.buttons = [];
  }

  addButton(button) {
    this.buttons.push(button);
  }

  enter() {

  }

  exit() {
    
  }
}
