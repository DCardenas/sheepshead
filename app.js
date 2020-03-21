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

  clientManager.onClientJoin(client);
  client.emit('init', {selfID: client.id});

  room.joinRoom(client);

  socket.on('sit', seatNum => {
    if (room.canSit(seatNum)) {
      if (client.seat !== null) {
        clientManager.emitAll('playerStand', {seat: client.seat});
        room.stand(client);
      }

      room.sit(seatNum, client);

      clientManager.emitAll('playerSit', {id: client.id, seat: seatNum});
    } else {
      socket.emit('warning', {msg: 'Seat already taken!'});
    }
  });

  socket.on('disconnect', data => {
    console.log('User Disconnected');
    room.leaveRoom(client);
    clientManager.onClientLeave(client.id);
  });
});
