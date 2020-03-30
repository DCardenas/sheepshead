import buildStatesUI from './states.js';
import Hitbox from '../Hitbox.js';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export default function createUI(socket, game) {
  const ui = new UI();
  const states = buildStatesUI(socket, game)

  states.forEach(state => {
    ui.addState(state);
  });

  return ui;
}

class UI {
  constructor() {
    this.activeState = null;
    this.states = new Map();

    this.x = 0;
    this.y = CANVAS_HEIGHT * 0.9;
    this.w = CANVAS_WIDTH;
    this.h = CANVAS_HEIGHT * 0.1;

    this.hitbox = new Hitbox(0, 0, 1, 1);

    this.createBuffer();
  }

  get bounds() {
    return this.hitbox.bounds;
  }

  update(game) {
    this.loadState(game);
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = this.w;
    this.buffer.height = this.h;
  }

  redrawBuffer() {
    if (this.activeState) {

      this.activeState.buttons.forEach(button => {

      })
    }
  }

  addState(state) {
    this.states.set(state.name, state);
  }

  loadState(game) {
    if (this.activeState && this.activeState.exit) {
      this.activeState.exit();
    }

    this.activeState = this.states.get(game.state);

    this.activeState.enter();
  }
}
