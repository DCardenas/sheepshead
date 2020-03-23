import Client from '../Client.js';

export default function setupSocket(clients, seats) {
  const socket = io();
  let selfID = null;

  function createClient(clientData) {
    const client = new Client(clientData);
    clients.set(client.id, client);

    if (client.seat !== null) {
      seats[client.seat].addPlayer(client);
    }
  }

  socket.on('init', data => {
    if (data.clients) {
      data.clients.forEach(clientData => {
        createClient(clientData);
      });
    }

    if (data.game) {
      data.game.ai.forEach(aiData => {
        createClient(aiData);
      });
    }
  });
  socket.on('remove', data => {
    if (data.clients) {
      data.clients.forEach(id => {
        const client = clients.get(id);
        if (client.seat !== null) {
          seats[client.seat].removePlayer();
        }
        clients.delete(id);
      });
    }
  });

  socket.on('playerSit', data => {
    // Do a sanity check that the user is still connected!! //
    seats[data.seat].addPlayer(clients.get(data.id));
  });

  socket.on('playerStand', data => {
    seats[data.seat].removePlayer();
  });

  socket.on('warning', data => {
    if (data.msg) {
      console.log(data.msg);
    }
  });

  return socket;
}
