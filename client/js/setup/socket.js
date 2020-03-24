import Client from '../client/Client.js';

export default function setupSocket(socket, clients, game) {
  const seats = game.seats;

  seats.forEach(seat => {
    seat.button.onclick = btn => {
      if (btn === 1) {
        socket.emit('userInput', {type: 'sit', data: { seat: seat.num }});
      }
    }
  });

  function createClient(clientData) {
    return new Client(clientData);
  }

  // REFACTOR THIS CODE //
  socket.on('init', data => {
    if (data.clients) {
      data.clients.forEach(clientData => {
        const client = createClient(clientData);
        clients.addClient(client);
      });
    }

    if (data.selfID) {
      clients.selfID = data.selfID;
    }

    if (data.state) {
      game.setState(data.state);
    }

    if (data.game) {
      game.serverUpdate(data.game, clients);
    }

    game.update();
  });

  socket.on('update', data => {
    if (data.state) {
      game.setState(data.state);
    }

    if (data.sit) {
      const client = clients.get(data.sit.id);
      seats[data.sit.seat].addPlayer(client);
    }

    if (data.stand) {
      seats[data.stand.seat].removePlayer();
    }

    if (data.clients) {
      data.clients.forEach(clientData => {
        const client = clients.get(clientData.id);
        client.serverUpdate(clientData);
        game.seats[client.seat].redraw = true;
      });
    }

    if (data.game) {
      game.serverUpdate(data.game, clients);
    }
  });

  socket.on('remove', data => {
    if (data.clients) {
      data.clients.forEach(id => {
        const client = clients.get(id);
        if (client.seat !== null) {
          game.removePlayer(id);
        }
        clients.removeClient(id);
      });
    }

    game.update();
  });

  socket.on('warning', data => {
    if (data.msg) {
      console.log(data.msg);
    }
  });

  return socket;
}
