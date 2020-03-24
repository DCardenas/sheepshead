import Hitbox from './Hitbox.js';
import Button from './ui/Button.js';
import { collisionPointRect } from './utils.js';

export default class Seat {
  constructor(num) {
    this.num = num;
    this.pos = num;
    this.w = 300;
    this.h = 150;
    this.player = null;

    this.redraw = true;
    this.hover = false;

    this.hitbox = new Hitbox(0, 0, 1, 1, this);
    this.button = new Button(
      this.w / 2, this.h / 2,
      120, 50,
      'Seat ' + this.num, this
    );

    this.createBuffer();
  }

  get bounds() {
    return this.hitbox.bounds;
  }

  getPlayerID() {
    if (this.player) {
      return this.player.id
    }

    return this.player
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = this.w;
    this.buffer.height = this.h;
  }

  redrawBuffer() {
    const ctx = this.buffer.getContext('2d');

    if (!this.player) {
      this.button.redrawBuffer();
      ctx.drawImage(
        this.button.buffer,
        this.button.x - this.button.w / 2,
        this.button.y - this.button.h / 2
      );
    } else {
      this.player.redrawBuffer();
      ctx.drawImage(this.player.buffer, 0, 0);
    }

    this.redraw = false;
  }

  addPlayer(player) {
    this.player = player;
    player.x = this.x;
    player.y = this.y;
    player.parent = this;
    this.redrawBuffer();
    player.redrawBuffer();
  }

  removePlayer() {
    this.player.x = null;
    this.player.y = null;
    this.player = null;
    this.player.parent = null;
    this.redrawBuffer();
  }

  checkMouseHover(x, y, settings) {
    const result = {
      target: null
    }

    if (this.player) {
      if (this.player.id === settings.selfID) {
        this.player.hand.forEach(card => {
          const rect = card.bounds;
          if (collisionPointRect({x: x, y: y}, rect)) {
            result.target = card;
          }
        })
      }
    } else {
      const rect = this.button.bounds;
      if (collisionPointRect({x: x, y: y}, rect)) {
        result.target = this.button;
      }
    }

    return result
  }
}
