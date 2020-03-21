class Game {
  constructor(settings) {
    this.maxPlayers = settings.maxPlayers || 5;
    this.partner = settings.partner || 'jack';
    this.doubleBump = settings.doubleBump || false;
    this.cracking = settings.cracking || false;
    this.blitzing = settings.blitzing || false;

    this.seats = {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null
    }

    this.state = 'pregame';
  }
}

module.exports = Game;
