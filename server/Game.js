const Client = require('./Client.js');
const Deck = require('./Deck.js');
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

    this.deck = new Deck();
    this.deck.populate();

    this.blind = new Deck();

    this.stateManager = setupStateManager(this);
  }

  get activeState() {
    return this.stateManager.activeState.name;
  }

  getActivePlayer() {
    return this.seats[this.activePlayer];
  }

  getPlayerByID(id) {
    let player = null;

    for (let i = 0; i < this.maxPlayers; i++) {
      if (this.seats[i] && this.seats[i].id === id) {
        player = this.seats[i];
        break
      }
    }

    return player
  }

  reset() {
    this.activePlayer = null;
    this.dealer = null;
    this.picker = null;
    this.partner = null;

    this.deck.clear();
    this.deck.populate();
    this.blind.clear();

    this.forEachSeat(player => {
      if (player) {
        player.hand.clear();
      }
    });
  }

  hardReset() {
    // Clear out the hands before telling everyone to stand up
    this.reset();

    // Enter pregame if not already
    if (this.activeState !== 'pregame') {
      this.stateManager.setState('pregame', this, pack => {
        this.room.emitAll('update', pack);
      });
    }

    // Make everyone stand up
    this.forEachSeat(player => {
      if (player !== null) {
        this.handleEvent('stand', { player: player, seat: player.seat });
      }
    });
  }

  determineDealer() {
    if (this.curPlayers === 0) {
      this.dealer = null;
      return
    }

    let dealerFound = false;
    this.forEachSeat((player, i) => {
      if (!dealerFound && player) {
        this.dealer = i;
        player.dealer = true;
        dealerFound = true;
      }
    });
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
    this.seats[seat].seat = null;
    this.seats[seat] = null;
    this.curPlayers -= 1;
  }

  nextPlayer() {
    if (!this.activePlayer) {
      this.activePlayer = this.dealer + 1;
      this.activePlayer %= this.curPlayers;
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
      // Sometimes events are sent that don't require an update
      if (res) {
        if (res.error) {
          this.room.emitOne(data.player.id, 'error-msg', res);
          console.log(res.msg);
        } else {
          this.room.emitAll('update', res);
        }
      }
    });
  }

  deal() {
    if (this.curPlayers !== this.maxPlayers) {
      // Something horrible has happened and we need to hardReset
      this.hardReset();
    }

    this.forEachSeat((player, i) => {
      this.deck.deal(player.hand, 3);
    });

    this.deck.deal(this.blind, 2);

    this.forEachSeat((player, i) => {
      this.deck.deal(player.hand, 3);
    });
  }

  pick(player) {
    if (!player.host && player.seat !== this.activePlayer) {
      console.log('Player trying to pick when it is not their turn!');
      return false
    }

    this.picker = this.activePlayer;
    this.blind.deal(this.getActivePlayer().hand, 2);

    return true
  }
}

module.exports = Game;
