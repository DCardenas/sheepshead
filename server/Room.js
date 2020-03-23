const Game = require('./Game.js');

class Room {
  constructor(settings) {
    this.game = new Game(settings);
    this.clients = new Map();
    this.id = Math.random();
  }

  joinRoom(client) {
    this.clients.set(client.id, client);
    client.room = this.id;
  }

  leaveRoom(client) {
    this.clients.delete(client.id);
    client.room = null;

    if (client.seat) {
      this.game.stand(client);
    }
  }

  addAI() {
    return this.game.addAI();
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
