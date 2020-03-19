const express = require("express");
const app = express();
const serv = require("http").Server(app);

const DEBUG = true;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

serv.listen(process.env.PORT || 5000);

console.log('Server started');
if (DEBUG) {
  console.log('WARNING: DEBUG is active. Do not deploy!');
}

class Client {
  constructor(socket, data) {
    this.socket = socket;

    for (let key in data) {
      this[key] = data[key];
    }
  }

  getInitPack() {
    const pack = {};
    pack.id = this.id;
    pack.name = this.name;
    return pack;
  }

  emit(type, data) {
    this.socket.emit(type, data);
  }

  on(type, callback) {
    this.socket.on(type, callback);
  }
}

const clients = new Map();
function emitAll(type, data) {
  clients.forEach(client => {
    client.emit(type, data);
  });
}

const io = require('socket.io')(serv, {});
io.sockets.on('connection', socket => {
  console.log('User Connected');

  const client = new Client(socket, {
    id: Math.random(),
    name: 'Daniel',
  });

  clients.set(client.id, client);

  emitAll('init', {clients: [client.getInitPack()]});
});
