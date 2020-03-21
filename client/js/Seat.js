import Hitbox from './Hitbox.js';

export default class Seat {
  constructor(num) {
    this.num = num;
    this.pos = num;
    this.w = 100;
    this.h = 50;
    this.hitbox = new Hitbox(0, 0, 1, 1, this);
    this.player = null;

    this.redraw = true;
    this.hover = false;
    this.createBuffer();
  }

  get bounds() {
    return this.hitbox.bounds;
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = this.w;
    this.buffer.height = this.h;

    this.redrawBuffer();
  }

  redrawBuffer() {
    const ctx = this.buffer.getContext('2d');
    ctx.fillStyle = 'red';

    if (this.hover) {
      ctx.fillStyle = 'green';
    }

    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '30px Arial';

    ctx.fillText('Sit', this.w / 2, this.h * 0.6);

    this.redraw = false;
  }
}
