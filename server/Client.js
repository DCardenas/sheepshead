class Client {
  constructor(socket, data) {
    this.socket = socket;

    for (let key in data) {
      this[key] = data[key];
    }

    this.seat = null;
  }

  getInitPack() {
    const pack = {};
    pack.id = this.id;
    pack.name = this.name;
    pack.seat = this.seat;
    return pack;
  }

  emit(type, data) {
    this.socket.emit(type, data);
  }

  on(type, callback) {
    this.socket.on(type, callback);
  }
}

module.exports = Client;
