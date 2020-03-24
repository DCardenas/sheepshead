import Card from './Card.js';

export default class Client {
  constructor(data) {
    this.hand = new Map();
    this.createBuffer();

    this.serverUpdate(data);
  }

  createBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = 300;
    this.buffer.height = 150;

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
    ctx.fillText(this.name, this.buffer.width / 2, 45);

    this.hand.forEach((card, i) => {
      ctx.drawImage(card.buffer, card.x - card.w / 2, card.y - card.h / 2);
    });

    this.redraw = false;
  }

  serverUpdate(data) {
    for (let key in data) {
      if (key === 'hand') {
        const totalCards = data[key].cards.length;
        data[key].cards.forEach((cardData, i) => {
          if (this.hand.has(cardData.id)) {
            return
          }

          const card = new Card(cardData, this);
          const x = this.buffer.width / 2 + (i + 0.5 - totalCards / 2) * card.w;
          const y = this.buffer.height - card.h / 2 - 10;

          console.log(x);

          card.x = x;
          card.y = y;
          this.hand.set(card.id, card);
        });

        this.redraw = true;
      } else {
        this[key] = data[key];
      }
    }
  }
}
