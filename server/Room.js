const Game = require('./Game.js');
const ClientManager = require('./ClientManager.js');

class Room {
  constructor(settings) {
    this.game = new Game(this, settings);
    this.clientManager = new ClientManager();
    this.bots = new ClientManager();
    this.id = Math.random();
  }

  emitOne(id, type, data) {
    this.clientManager.emitOne(id, type, data);
  }

  emitAll(type, data) {
    this.clientManager.emitAll(type, data);
  }

  handleEvent(data) {
    if (data.type === 'roomEvent') {

    } else {
      this.game.handleEvent(data.type, data.data);
    }
  }

  joinRoom(client) {
    this.clientManager.add(client);
    client.room = this;
  }

  leaveRoom(client) {
    this.clientManager.remove(client.id);
    client.room = null;

    if (client.seat !== null) {
      this.game.handleEvent('stand', { player: client, seat: client.seat });
    }
  }

  addAI() {
    const ai = this.game.addAI();

    if (ai) {
      this.bots.add(ai);
    }
  }

  clearAI() {
    if (this.bots.length === 0) {
      return
    }

    const pack = {
      clients: []
    }

    this.bots.forEach(bot => {
      pack.clients.push(bot.id);
    });

    this.bots.clear();

    this.emitAll('remove', pack);
  }

  removeAI(ai) {
    this.bots.delete(ai.id);
    this.emitAll('remove', { clients: [ai.id] });
  }

  canSit(seatNum) {
    return this.game.canSit(seatNum);
  }

  sit(seatNum, client) {
    this.game.sit(seatNum, client);
  }

  stand(client) {
    this.game.stand(client);
  }

  getInitPack() {
    const pack = {
      clients: this.clientManager.getInitPackAll().concat(this.bots.getInitPackAll()),
      state: this.game.activeState,
      game: this.game.getInitPack()
    }

    pack.clients.push()

    return pack;
  }
}

module.exports = Room;
