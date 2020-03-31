import Deck from '../Deck.js';
import Hitbox from '../Hitbox.js';
import { collisionPointRect } from '../utils.js';

export default class Client {
  constructor(data) {
    this.hand = new Deck('hand', this);
    this.bury = new Deck('bury', this);

    this.createBuffer();

    this.hitbox = new Hitbox(0, 0, 1, 1, this);
    this.isHost = false;

    this.serverUpdate(data);
  }

  get bounds() {
    if (typeof this.parent === undefined || this.parent === null) {
      return this.hitbox.bounds
    }

    return this.parent.bounds;
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = 300;
    this.buffer.height = 120;

    this.redrawBuffer();
  }

  redrawBuffer() {
    const ctx = this.buffer.getContext('2d');

    ctx.fillStyle = 'green';
    if (this.active) {
      ctx.fillStyle = 'yellow';
    }
    ctx.fillRect(0, 0, this.buffer.width, this.buffer.height);

    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '30px Arial';
    ctx.fillText(this.name, this.buffer.width / 2, 30);

    this.hand.cards.forEach((card, i) => {
      if (card.redraw) {
        card.redrawBuffer();
      }

      if (card.selected) {
        return
      }

      const x = card.x - card.w / 2;
      const y = card.y - card.h / 2 - (card.hover || card.serverHover ? 10 : 0);
      ctx.drawImage(card.buffer, x, y);
    });

    this.redraw = false;
  }

  checkMouseHover(pos) {
    let target = null;

    this.hand.cards.forEach(card => {
      const rect = card.bounds;
      if (collisionPointRect(pos, rect)) {
        target = card;
      }
    });

    return target
  }

  serverUpdate(data) {
    for (let key in data) {
      if (key === 'hand' || key === 'bury') {
        this[key].serverUpdate(data[key]);
        this.redraw = true;
      } else {
        this[key] = data[key];
      }
    }
  }
}
