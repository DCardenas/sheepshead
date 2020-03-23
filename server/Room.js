const Game = require('./Game.js');
const ClientManager = require('./ClientManager.js');

class Room {
  constructor(settings) {
    this.game = new Game(this, settings);
    this.clientManager = new ClientManager();
    this.bots = new Map();
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
    client.room = this.id;
  }

  leaveRoom(client) {
    this.clientManager.remove(client.id);
    client.room = null;

    if (client.seat) {
      this.game.stand(client);
    }
  }

  addAI() {
    const ai = this.game.addAI();

    if (ai) {
      this.bots.set(ai.id, ai);
    }
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
}

module.exports = Room;
