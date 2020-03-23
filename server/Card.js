class Card {
  constructor(face, suit) {
    this.f = face;
    this.s = suit;
  }

  print() {
    console.log(this.f + ' of ' + this.s);
  }
}

module.exports = Card;
