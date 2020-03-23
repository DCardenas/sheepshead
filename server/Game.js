const Client = require('./Client.js');
const setupStateManager = require('./states.js');

class Game {
  constructor(room, settings) {
    this.room = room;

    this.maxPlayers = settings.maxPlayers || 5;
    this.partner = settings.partner || 'jack';
    this.doubleBump = settings.doubleBump || false;
    this.cracking = settings.cracking || false;
    this.blitzing = settings.blitzing || false;

    this.curPlayers = 0;
    this.seats = {
      0: null,
      1: null,
      2: null,
      3: null,
      4: null
    }

    this.stateManager = setupStateManager(this);
  }

  forEachSeat(callback) {
    for (let i = 0; i < this.maxPlayers; i++) {
      const player = this.seats[i];

      callback(player, i);
    }
  }

  getInitPack() {
    const pack = {};
    pack.ai = [];

    this.forEachSeat(player => {
      if (player && !player.socket) {
        pack.ai.push(player.getInitPack());
      }
    });

    return pack;
  }

  addAI() {
    let ai = null;
    this.forEachSeat((player, i) => {
      if (ai) {
        return
      }

      if (player === null) {
        ai = new Client(null, {
          id: Math.random(),
          name: 'Kyle' + Math.floor(Math.random() * 100),
          seat: i
        });

        this.seats[i] = ai;
        this.curPlayers += 1;
      }
    });

    return ai;
  }

  canSit(seatNum) {
    return this.seats[seatNum] === null;
  }

  sit(seatNum, client) {
    if (this.seats[seatNum] !== null) {
      return false;
    } else {
      this.seats[seatNum] = client;
      client.seat = seatNum;
      this.curPlayers += 1;

      this.handleEvent('sit', {game: this, seat: seatNum});
    }
  }

  stand(client) {
    this.seats[client.seat] = null;
    this.curPlayers -= 1;
    client.seat = null;

    this.handleEvent('stand', this);
  }

  handleEvent(type, data) {
    this.stateManager.handleEvent(type, data);
  }
}

module.exports = Game;
