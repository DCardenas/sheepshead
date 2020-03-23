const StateManager = require('./StateManager.js');
const State = require('./State.js');

function setupStateManager(gameState) {
  const stateManager = new StateManager();

  const pregame = new State('pregame');
  const picking = new State('picking');
  const burying = new State('burying');
  const playing = new State('playing');

  pregame.enter = gameState => {
    if (gameState.curPlayers !== 0) {
      let dealerFound = false;
      gameState.forEachSeat((player, i) => {
        if (!dealerFound && player) {
          gameState.dealer = i;
          player.dealer = true;
          dealerFound = true;
        }
      });
    }
  }
  pregame.addCallback('sit', (data, gameState) => {
    const pack = { success: true, clients: [] };

    // You can't sit here!
    if (!gameState.canSit(data.seat)) {
      pack.success = false;
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

    pack.dealer = data.seat;
    pack.clients.push(data.player.getUpdatePack(['seat', 'dealer']));

    return pack;
  });
  pregame.nextState = 'picking';

  picking.handleEvent('pick', gameState => {

  });

  stateManager.activeState = pregame;
  return stateManager;
}

module.exports = setupStateManager;
