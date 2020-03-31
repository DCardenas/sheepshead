import Client from '../client/Client.js';
import { exists } from '../utils.js';

export default function setupSocket(socket, clients, game, mouse) {
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
    if (exists(data.selfID)) {
      clients.selfID = data.selfID;
    }

    if (exists(data.clients)) {
      data.clients.forEach(clientData => {
        const client = createClient(clientData);
        clients.addClient(client);
      });
    }

    if (exists(data.state)) {
      game.setState(data.state);
    }

    if (exists(data.game)) {
      game.serverUpdate(data.game, clients);

      if (exists(data.game.ai)) {
        data.game.ai.forEach(aiData => {
          const ai = createClient(aiData);
          clients.addClient(ai);
        });
      }
    }

    game.update();
  });

  socket.on('update', data => {
    if (exists(data.state)) {
      game.setState(data.state);
    }

    if (exists(data.stand)) {
      game.removePlayer(data.stand.seat);
    }

    if (exists(data.sit)) {
      const client = clients.getClientByID(data.sit.id);
      game.addPlayer(data.sit.seat, client);
    }

    if (exists(data.clients)) {
      data.clients.forEach(clientData => {
        const client = clients.getClientByID(clientData.id);
        client.serverUpdate(clientData);
        game.seats[client.seat].redraw = true;
      });
    }

    if (exists(data.game)) {
      game.serverUpdate(data.game, clients);

      if (data.game.ai) {
        data.game.ai.forEach(aiData => {
          const ai = createClient(aiData);
          clients.addClient(ai);
        });
      }
    }

    if (exists(data.mouse)) {
      if (data.mouse.select) {
        const client = clients.getClientByID(data.mouse.parent);
        const card = client[data.mouse.deck].getCardByID(data.mouse.id);
        card.selected = true;
        mouse.selections.set(card.id, card);
      } else {
        const card = mouse.selections.get(data.mouse.id);
        card.selected = false;
        mouse.selections.delete(data.mouse.id);
      }
    }

    game.update();
  });

  socket.on('remove', data => {
    if (exists(data.clients)) {
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
    if (exists(data.msg)) {
      console.log(data.msg);
    }
  });

  return socket
}
