class Card {
  constructor(face, suit) {
    this.f = face;
    this.s = suit;
    this.id = Math.random();
  }

  print() {
    console.log(this.f + ' of ' + this.s);
  }
}

module.exports = Card;
