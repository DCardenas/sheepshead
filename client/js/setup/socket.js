import Client from '../Client.js';

export default function setupSocket(clients, seats, gameState) {
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
      for (let key in data.game) {
        if (data.game[key] === null) {
          continue
        }

        if (key === 'ai') {
          data.game.ai.forEach(aiData => {
            createClient(aiData);
          });
        } else {
          if (gameState[key] !== null) {
            const seat = seats[gameState[key]]
            seat.redraw = true;

            if (key === 'activePlayer') {
              const client = seat.player;
              client.active = false;
            }
          }

          gameState[key] = data.game[key];

          const seat = seats[gameState[key]]
          seat.redraw = true;

          if (key === 'activePlayer') {
            const client = seat.player;
            client.active = true;
          }
        }
      }
    }
  });

  socket.on('update', data => {
    if (data.state) {
      gameState.setState('pregame');
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
        seats[client.seat].redraw = true;
      });
    }

    if (data.game) {
      for (let key in data.game) {
        if (key === 'activePlayer') {
            if (gameState.activePlayer) {
              const seat = seats[gameState.activePlayer]
              seat.redraw = true;

              const client = seat.player;
              client.active = false;
            }

            gameState[key] = data.game[key];

            const seat = seats[gameState.activePlayer]
            seat.redraw = true;

            const client = seat.player;
            client.active = true;
        } else {
          gameState[key] = data.game[key];
        }
      }
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
