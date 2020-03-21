export default class Hitbox {
  constructor(x, y, w, h, parent) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.parent = parent;
  }

  get bounds() {
    const x = this.parent.x + this.parent.w * this.x;
    const y = this.parent.y + this.parent.h * this.y;

    return {
      left: x,
      right: x + this.parent.w * this.w,
      top: y,
      bot: y + this.parent.h * this.h
    }
  }
}
