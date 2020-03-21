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
  }
}

module.exports = Room;
