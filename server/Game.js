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

    this.activePlayer = null;
    this.dealer = null;
    this.picker = null;
    this.partner = null;

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

  reset() {
    this.activePlayer = null;
    this.dealer = null;
    this.picker = null;
    this.partner = null;
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

    pack.activePlayer = this.activePlayer;
    pack.dealer = this.dealer;

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
          name: 'Kyle' + Math.floor(Math.random() * 100)
        });

        this.room.emitAll('init', { clients: [ ai.getInitPack() ] });
        this.handleEvent('sit', { seat: i, player: ai });
      }
    });

    return ai
  }

  canSit(seat) {
    return this.seats[seat] === null;
  }

  sit(seat, client) {
    this.seats[seat] = client;
    client.seat = seat;
    this.curPlayers += 1;
  }

  stand(seat) {
    this.seats[seat] = null;
    this.curPlayers -= 1;
  }

  nextPlayer() {
    if (!this.activePlayer) {
      this.activePlayer = this.dealer + 1;
      this.seats[this.activePlayer].active = true;
    } else {
      this.seats[this.activePlayer].active = false;
      this.activePlayer += 1;
      this.activePlayer %= this.curPlayers;
      this.seats[this.activePlayer].active = true;
    }
  }

  handleEvent(type, data) {
    this.stateManager.handleEvent(type, data, this, res => {
      if (res.error) {
        this.room.emitOne(data.player.id, 'error-msg', res);
        console.log(res.msg);
      } else {
        this.room.emitAll('update', res);
      }
    });
  }
}

module.exports = Game;
