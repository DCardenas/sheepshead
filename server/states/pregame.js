const State = require('./State.js');

function createPregameState() {
  const pregame = new State('pregame');

  pregame.enter = gameState => {
    const pack = {
      game: {},
      clients: []
    };

    gameState.reset();

    if (gameState.curPlayers !== 0) {
      gameState.determineDealer();
    }

    pack.game.dealer = gameState.dealer;
    pack.game.picker = gameState.picker;
    pack.game.partner = gameState.partner;
    pack.game.activePlayer = gameState.activePlayer;
    pack.game.state = pregame.name;

    gameState.forEachSeat(player => {
      if (player) {
        pack.clients.push(player.getUpdatePack(['hand']));
      }
    });

    return pack
  }
  pregame.exit = gameState => {
    
  }
  pregame.addCallback('sit', (data, gameState) => {
    const pack = { clients: [], game: {} };

    // You can't sit here!
    if (!gameState.canSit(data.seat)) {
      pack.error = true;
      pack.msg = 'Seat is already taken.';

      return pack;
    }

    // You can sit here!
    pack.sit = {
      seat: data.seat,
      id: data.player.id
    }
    // But you were sitting elsewhere
    if (data.player.seat !== null) {
      pack.stand = {
        seat: data.player.seat
      }
      gameState.stand(data.player.seat);
    }
    gameState.sit(data.seat, data.player); // This function sets the player's new seat

    // Check if we should move to the next state
    if (gameState.curPlayers === gameState.maxPlayers) {
      pregame.toExit = true;
    } else if (gameState.curPlayers === 1) {
      // If this is the first or only player to sit, they are now the dealer
      gameState.dealer = data.seat;
      gameState.seats[data.seat].dealer = true;
    }

    pack.clients.push(data.player.getUpdatePack(['seat']));

    pack.game.dealer = gameState.dealer;

    return pack;
  });
  pregame.nextState = 'picking';

  return pregame;
}

module.exports = createPregameState;
