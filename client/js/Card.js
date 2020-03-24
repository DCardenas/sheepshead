import Hitbox from './Hitbox.js';

export default class Card {
  constructor(data, parent) {
    this.f = data.f;
    this.s = data.s;
    this.id = data.id;

    this.hover = false;
    this.selected = false;

    this.x = null;
    this.y = null;
    this.w = 45;
    this.h = 70;

    this.hitbox = new Hitbox(0, 0, 1, 1);

    this.createBuffer();
  }

  get bounds() {

  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = this.w;
    this.buffer.height = this.h;

    this.redrawBuffer();
  }

  redrawBuffer() {
    const ctx = this.buffer.getContext('2d');

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'white';

    ctx.beginPath();
    ctx.rect(0, 0, this.buffer.width, this.buffer.height);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    if (this.s === 'H' || this.s === 'D') {
      ctx.fillStyle = 'red';
    }

    ctx.font = '22px Arial';

    ctx.fillText(this.f + this.s, this.w / 2, this.h * 0.55);
  }
}
