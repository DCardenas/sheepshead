export default class ClientManager {
  constructor() {
    this.clients = new Map();
    this.localClient = null;
    this.selfID = null;
  }

  forEach(callback) {
    this.clients.forEach((client, i) => {
      callback(client, i);
    })
  }

  addClient(client) {
    if (client.id === this.selfID && this.localClient === null) {
      this.localClient = client;
      client.isHost = true;
    }

    this.clients.set(client.id, client);
  }

  getClientByID(id) {
    if (this.clients.has(id)) {
      return this.clients.get(id)
    }

    return null
  }

  removeClient(id) {
    this.clients.delete(id);
  }
}
