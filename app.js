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

const Room = require('./server/Room.js');
const Client = require('./server/Client.js');
const ClientManager = require('./server/ClientManager.js');
const clientManager = new ClientManager();

const room = new Room({});
const io = require('socket.io')(serv, {});
io.sockets.on('connection', socket => {
  console.log('User Connected');

  const client = new Client(socket, {
    id: Math.random(),
    name: 'Dan' + Math.floor(Math.random() * 100),
  });

  room.joinRoom(client);
  clientManager.onClientJoin(client);
  client.emit('init', {
    selfID: client.id, game: room.game.getInitPack()
  });

  socket.on('userInput', data => {
    data.data.player = client;
    room.handleEvent(data);
  });

  // Need to add check that they own the room
  socket.on('addAI', () => {
    room.addAI();
  });

  socket.on('disconnect', data => {
    console.log('User Disconnected');
    room.leaveRoom(client);
    clientManager.onClientLeave(client.id);
  });
});
