import Hitbox from './Hitbox.js';

class Card {
  constructor(face, suit, parent) {
    this.f = face;
    this.s = suit;

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

export default class Client {
  constructor(data) {
    for (let key in data) {
      this[key] = data[key];
    }

    this.createBuffer();
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = 300;
    this.buffer.height = 220;

    this.redrawBuffer();
  }

  redrawBuffer() {
    const ctx = this.buffer.getContext('2d');

    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, this.buffer.width, this.buffer.height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.name, this.width / 2, this.height / 2);

    if (this.hand) {
      this.hand.forEach((card, i) => {
        ctx.drawImage(card.buffer, card.x, card.y);
      });
    }

    this.redraw = false;
  }

  serverUpdate(data) {
    for (let key in data) {
      if (key === 'hand') {
        this.hand = [];
        data[key].cards.forEach((cardData, i) => {
          const card = new Card(cardData.f, cardData.s, this);
          const x = i * card.w + 10;
          const y = 10;

          card.x = x;
          card.y = y;
          this.hand.push(card);
        });

        this.redraw = true;
      } else {
        this[key] = data[key];
      }
    }
  }
}
