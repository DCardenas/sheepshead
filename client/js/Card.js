import Hitbox from './Hitbox.js';

const CARD_WIDTH = 45;
const CARD_HEIGHT = 70;

export default class Card {
  constructor(data, parent, deck) {
    this.f = data.f;
    this.s = data.s;
    this.id = data.id;
    this.parent = parent;
    this.deck = deck;

    this.serverHover = data.serverHover;
    this.hover = false;
    this.selected = false;

    this.x = null;
    this.y = null;
    this.w = CARD_WIDTH * 0.8;
    this.h = CARD_HEIGHT * 0.8;

    this.updated = true;

    this.bgColor = 'white';

    this.hitbox = new Hitbox(0, 0, 1, 1, this);

    this.createBuffer();
  }

  get bounds() {
    if (typeof this.parent === undefined || this.parent === null) {
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

  serverUpdate(data) {
    for (let key in data) {
      this[key] = data[key];
    }

    this.updated = true;
  }

  print() {
    return `${this.f} of ${this.s}`
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = this.w;
    this.buffer.height = this.h;
    this.redraw = true;

    this.redrawBuffer();
  }

  onenter(socket) {
    this.enters += 1;

    this.hover = true;
    this.bgColor = 'yellow';
    this.redraw = true;

    socket.emit('userInput', {
      type: 'hover',
      data: {
        id: this.id,
        hover: true,
        parent: this.parent.id
      }
    });

    return '-webkit-grab'
  }

  onexit(socket) {
    this.exits += 1;

    this.hover = false;
    this.bgColor = 'white';
    this.redraw = true;

    socket.emit('userInput', {
      type: 'hover',
      data: {
        id: this.id,
        hover: false,
        parent: this.parent.id
      }
    });
  }

  onmousedown(btn, pos, socket) {
    if (btn === 1) {
      socket.emit('userInput', { type: 'cardSelected', data: {
        id: this.id,
        deck: this.deck,
        parent: this.parent.id,
        pos: pos
      }});

      this.oldX = this.x;
      this.oldY = this.y;

      this.x = pos.x;
      this.y = pos.y;

      this.selected = true;
      this.parent.redraw = true;
    }

    return '-webkit-grabbing'
  }

  onmousemove(pos, socket) {
    socket.emit('userInput', { type: 'cardMoved', data: {
      id: this.id,
      deck: this.deck,
      parent: this.parent.id,
      pos: pos
    }});

    this.x = pos.x;
    this.y = pos.y;
  }

  onmouseup(btn, target, socket) {
    if (btn === 1) {
      socket.emit('userInput', { type: 'cardReleased', data: {
        id: this.id,
        deck: this.deck,
        parent: this.parent.id,
        target: target,
      }});

      this.x = this.oldX;
      this.y = this.oldY;

      this.selected = false;
      this.parent.redraw = true;
    }
  }

  redrawBuffer() {
    const ctx = this.buffer.getContext('2d');

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.fillStyle = this.bgColor;

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

    ctx.font = '18px Arial';

    ctx.fillText(this.f + this.s, this.w / 2, this.h * 0.55);

    this.redraw = false;
  }
}
