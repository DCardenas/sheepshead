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

  canSit(seatNum) {
    return this.seats[seatNum] === null;
  }

  sit(seatNum, client) {
    if (this.seats[seatNum] !== null) {
      return false;
    } else {
      this.seats[seatNum] = client.id;
      client.seat = seatNum;
    }
  }

  stand(client) {
    this.seats[client.seat] = null;
    client.seat = null;
  }
}

module.exports = Game;
