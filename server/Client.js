const Deck = require('./Deck.js');

class Client {
  constructor(socket, data) {
    this.socket = socket;
    this.seat = null;
    this.hand = new Deck();
    this.bury = new Deck();

    for (let key in data) {
      this[key] = data[key];
    }
  }

  getInitPack() {
    const pack = {};
    pack.id = this.id;
    pack.name = this.name;
    pack.seat = this.seat;
    pack.hand = this.hand;
    pack.bury = this.bury;
    return pack;
  }

  getUpdatePack(keys) {
    const pack = {};

    pack.id = this.id;
    if (keys.length === 0) {
      console.log('Trying to get an update pack without requesting keys');
      return
    }

    keys.forEach(key => {
      pack[key] = this[key];
    });

    return pack;
  }

  hoverCard(id, hover) {
    const card = this.hand.getCardByID(id);

    if (card) {
      card.serverHover = hover;
    }
  }

  emit(type, data) {
    if (!this.socket) {
      return
    }
    this.socket.emit(type, data);
  }

  on(type, callback) {
    this.socket.on(type, callback);
  }
}

module.exports = Client;
