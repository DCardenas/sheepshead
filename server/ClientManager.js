2

class ClientManager {
  constructor() {
    this.clients = new Map();
  }

  add(client) {
    this.clients.set(client.id, client);
  }

  remove(id) {
    this.clients.delete(id);
  }

  clear() {
    this.clients.clear();
  }

  forEach(callback) {
    this.clients.forEach((client, id, map) => {
      callback(client, id, map);
    });
  }

  onClientJoin(client) {
    this.emitAll('init', {clients: [client.getInitPack()]});
    this.add(client);
    const roomPack = client.room.getInitPack();
    roomPack.selfID = client.id;
    client.emit('init', roomPack);
  }

  onClientLeave(id) {
    this.remove(id);
    this.emitAll('remove', {clients: [id]});
  }

  getInitPackAll() {
    const pack = [];
    this.clients.forEach(client => {
      pack.push(client.getInitPack());
    });
    return pack;
  }

  emitAll(type, data) {
    this.clients.forEach(client => {
      client.emit(type, data);
    });
  }

  emitOne(id, type, data) {
    if (this.clients.has(id)) {
      this.clients.get(id).emit(type, data);
    } else {
      console.log('Could not find client with id ' + id);
      console.log('Trying to emit event ' + type);
    }
  }

  on(type, callback) {
    this.clients.forEach(client => {
      client.on(type, callback);
    });
  }
}

module.exports = ClientManager;
