export default class Seat {
  constructor(num) {
    this.num = num;
    this.w = 100;
    this.h = 50;
    this.player = null;
    this.createBuffer();
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
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '30px Arial';

    ctx.fillText('Sit', this.w / 2, this.h * 0.6);
  }
}
