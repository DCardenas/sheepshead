const faces = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['C', 'S', 'H', 'D'];

const Card = require('./Card.js');

class Deck {
  constructor() {
    this.cards = [];
  }

  populate() {
    suits.forEach(suit => {
      faces.forEach(face => {
        this.cards.push(new Card(face, suit));
      });
    });

    this.shuffle();
  }

  print() {
    this.cards.forEach(card => {
      card.print();
    });
  }

  shuffle(num=5) {
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < this.cards.length; j++) {
        let randIndex = Math.floor(Math.random() * this.cards.length);
        let tempCard = this.cards[j];

        this.cards[j] = this.cards[randIndex];
        this.cards[randIndex] = tempCard;
      }
    }
  }

  addCard(card) {
    this.cards.push(card);
  }

  deal(target, num) {
    for (let i = 0; i < num; i++) {
      const card = this.cards[0];

      target.addCard(card);
      this.cards.shift();
    }
  }

  clear() {
    this.cards = [];
  }
}

module.exports = Deck;
