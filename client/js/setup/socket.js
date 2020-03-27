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
    const client = new Client(clientData);

    if (client.seat !== null) {
      game.addPlayer(client.seat, client);
    }

    return client
  }

  // REFACTOR THIS CODE //
  socket.on('init', data => {
    if (data.selfID !== null && typeof data.selfID !== 'undefined') {
      clients.selfID = data.selfID;
    }

    if (data.clients !== null && typeof data.clients !== 'undefined') {
      data.clients.forEach(clientData => {
        const client = createClient(clientData);
        clients.addClient(client);
      });
    }

    if (data.state !== null && typeof data.state !== 'undefined') {
      game.setState(data.state);
    }

    if (data.game !== null && typeof data.game !== 'undefined') {
      game.serverUpdate(data.game, clients);

      if (data.game.ai !== null && typeof data.game.ai !== 'undefined') {
        data.game.ai.forEach(aiData => {
          const ai = createClient(aiData);
          clients.addClient(ai);
        });
      }
    }

    game.update();
  });

  socket.on('update', data => {
    if (data.state !== null && typeof data.state !== 'undefined') {
      game.setState(data.state);
    }

    if (data.stand !== null && typeof data.stand !== 'undefined') {
      game.removePlayer(data.stand.seat);
    }

    if (data.sit !== null && typeof data.sit !== 'undefined') {
      const client = clients.getClientByID(data.sit.id);
      game.addPlayer(data.sit.seat, client);
    }

    if (data.clients !== null && typeof data.clients !== 'undefined') {
      data.clients.forEach(clientData => {
        const client = clients.getClientByID(clientData.id);
        client.serverUpdate(clientData);
        game.seats[client.seat].redraw = true;
      });
    }

    if (data.game !== null && typeof data.game !== 'undefined') {
      game.serverUpdate(data.game, clients);

      if (data.game.ai) {
        data.game.ai.forEach(aiData => {
          const ai = createClient(aiData);
          clients.addClient(ai);
        });
      }
    }

    game.update();
  });

  socket.on('remove', data => {
    if (data.clients !== null && typeof data.clients !== 'undefined') {
      data.clients.forEach(id => {
        const client = clients.getClientByID(id);
        if (!client) {
          console.log('Could not find client!');
          return
        }

        if (client.seat !== null) {
          game.removePlayer(client.seat);
        }
        clients.removeClient(id);
      });
    }

    game.update();
  });

  socket.on('warning', data => {
    if (data.msg !== null && typeof data.msg !== 'undefined') {
      console.log(data.msg);
    }
  });

  return socket
}
