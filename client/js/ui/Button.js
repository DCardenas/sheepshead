import Hitbox from '../Hitbox.js';

export default class Button {
  constructor(x, y, w, h, text, parent) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hitbox = new Hitbox(0, 0, 1, 1, this);
    this.text = text;

    this.parent = parent;
    this.hover = false;

    this.buffer = document.createElement('canvas');
    this.buffer.width = this.w;
    this.buffer.height = this.h;

    this.redrawBuffer();
  }

  get bounds() {
    if (!this.parent) {
      return this.hitbox.bounds
    }

    const parentRect = this.parent.bounds;
    const ourRect = this.hitbox.bounds;

    return {
      left: parentRect.left + ourRect.left,
      right: parentRect.left + ourRect.right,
      top: parentRect.top + ourRect.top,
      bot: parentRect.top + ourRect.bot
    }
  }

  redrawBuffer() {
    const ctx = this.buffer.getContext('2d');
    ctx.fillStyle = '#e37724';

    if (this.hover) {
      ctx.fillStyle = '#d15706';
    }

    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '24px Arial';

    ctx.fillText(this.text, this.w / 2, this.h * 0.55);
  }
}
