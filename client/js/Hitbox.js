export default class Hitbox {
  constructor(x, y, w, h, parent) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.parent = parent;
  }

  get bounds() {
    const x = this.parent.x + this.parent.w * this.x - this.parent.w / 2;
    const y = this.parent.y + this.parent.h * this.y - this.parent.h / 2;

    return {
      left: x,
      right: x + this.parent.w * this.w,
      top: y,
      bot: y + this.parent.h * this.h
    }
  }
}
