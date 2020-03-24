import Hitbox from './Hitbox.js';
import setupSeats from './setup/seats.js';
import createUI from './ui/ui.js';

export default class Game {
  constructor(width, height, socket) {
    this.x = 0;
    this.y = 0;
    this.w = width;
    this.h = height;

    this.seats = setupSeats(width, height);
    this.ui = createUI(socket, this);
    this.state = 'pregame';

    this.dealer = null;
    this.activePlayer = null;

    this.hitbox = new Hitbox(0, 0, 1, 1, this);
  }

  get bounds() {
    return {
      left: 0,
      right: this.w,
      top: this.h,
      bot: 0,
    }
  }

  setState(state) {
    this.state = state;
    this.redraw = true;
  }

  getUI() {
    return this.ui.states[this.state];
  }

  getActivePlayer() {
    if (this.activePlayer) {
      return this.seats[this.activePlayer]
    }

    return null
  }

  update() {
    this.ui.update(this);
  }

  serverUpdate(data, clients) {
    let update = false;

    for (let key in data) {
      if (data[key] !== null) {
        this[key] = data[key];

        update = true;
      }
    }

    if (update) {
      this.update();
    }
  }
}
