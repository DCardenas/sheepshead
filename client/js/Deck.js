import Card from './Card.js';

export default class Deck {
  constructor(name, parent) {
    this.cards = new Map();
    this.name = name;
    this.parent = parent;
  }

  getCard(id) {
    let result = null;

    this.cards.forEach(card => {
      if (!result && card.id === id) {
        result = card;
      }
    })

    return result
  }

  serverUpdate(data) {
    data.cards.forEach((cardData, i) => {
      const ourCard = this.getCard(cardData.id);

      if (ourCard) {
        ourCard.serverUpdate(cardData);
      } else {
        const card = new Card(cardData, this.parent, this.name);
        this.cards.set(card.id, card);
      }
    });

    this.cards.forEach(card => {
      if (!card.updated) {
        this.cards.delete(card.id);
      } else {
        card.updated = false;
      }
    });

    this.updatePos();
  }

  updatePos() {
    let i = 0;
    const totalCards = this.cards.size;
    this.cards.forEach(card => {
      const x = this.parent.buffer.width / 2 + (i + 0.5 - totalCards / 2) * card.w;
      const y = this.parent.buffer.height - card.h / 2 - 10;

      card.x = x;
      card.y = y;

      i++;
    });
  }

  update() {

  }
}
