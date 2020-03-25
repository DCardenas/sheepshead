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
    if (data.selfID) {
      clients.selfID = data.selfID;
    }

    if (data.clients) {
      data.clients.forEach(clientData => {
        const client = createClient(clientData);
        clients.addClient(client);
      });
    }

    if (data.state) {
      game.setState(data.state);
    }

    if (data.game) {
      game.serverUpdate(data.game, clients);

      if (data.game.ai) {
        data.game.ai.forEach(aiData => {
          const ai = createClient(aiData);
          clients.addClient(ai);

          if (ai.seat) {
            game.addPlayer(ai.seat, ai);
          }
        });
      }
    }

    game.update();
  });

  socket.on('update', data => {
    if (data.state) {
      game.setState(data.state);
    }

    if (data.sit) {
      const client = clients.getClientByID(data.sit.id);
      game.addPlayer(data.sit.seat, client);
    }

    if (data.stand) {
      game.removePlayer(data.stand.seat);
    }

    if (data.clients) {
      data.clients.forEach(clientData => {
        const client = clients.getClientByID(clientData.id);
        client.serverUpdate(clientData);
        game.seats[client.seat].redraw = true;
      });
    }

    if (data.game) {
      game.serverUpdate(data.game, clients);

      if (data.game.ai) {
        data.game.ai.forEach(aiData => {
          const ai = createClient(aiData);
          clients.addClient(ai);

          if (ai.seat) {
            game.addPlayer(ai.seat, ai);
          }
        });
      }
    }
  });

  socket.on('remove', data => {
    if (data.clients) {
      data.clients.forEach(id => {
        const client = clients.getClientByID(id);
        if (client.seat !== null) {
          game.removePlayer(client.seat);
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
