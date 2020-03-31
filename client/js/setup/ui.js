import buildStatesUI from './states.js';
import Hitbox from '../Hitbox.js';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

export default function createUI(socket, game) {
  const ui = new UI();
  const states = buildStatesUI(socket, game, ui)

  states.forEach(state => {
    ui.addState(state);
  });

  return ui;
}

class UI {
  constructor() {
    this.activeState = null;
    this.states = new Map();

    this.x = CANVAS_WIDTH * 0.5;
    this.y = CANVAS_HEIGHT * 0.95;
    this.w = CANVAS_WIDTH;
    this.h = CANVAS_HEIGHT * 0.1;

    this.hitbox = new Hitbox(0, 0, 1, 1, this);

    this.createBuffer();
  }

  get bounds() {
    return this.hitbox.bounds;
  }

  update(game) {
    this.loadState(game);

    this.redrawBuffer();
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = this.w;
    this.buffer.height = this.h;
  }

  redrawBuffer() {
    if (this.activeState) {
      const ctx = this.buffer.getContext('2d');
      ctx.clearRect(0, 0, this.w, this.h);
      this.activeState.buttons.forEach(button => {
        if (button.redraw) {
          button.redrawBuffer();
        }
        
        if (button.active) {
          ctx.drawImage(button.buffer, button.x - button.w / 2 , button.y - button.h / 2);
        }
      });
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
