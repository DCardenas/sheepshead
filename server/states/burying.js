const State = require('./State.js');

function createBuryingState() {
  const burying = new State('burying');

  burying.enter = gameState => {
    const pack = {
      game: {},
      clients: []
    }

    gameState.picker = gameState.activePlayer;

    pack.clients.push(gameState.getActivePlayer().getUpdatePack(['hand']));

    return pack
  }
  burying.addCallback('cardMoved', (data, gameState) => {
    if (!data.player.host && data.player.id !== data.getActivePlayer().id) {
      return {
        err: true,
        msg: 'Not your turn!'
      }
    }

    const player = gameState.getPlayerByID(data.parent);
    const pack = {
      clients: []
    }

    const deck = data.deck;
    const card = player[deck].getCardByID(data.id);

    if (deck === 'hand') {
      player.bury.push(card);
      player.hand.removeCard(card);
    } else {
      player.hand.push(card);
      player.bury.removeCard(card);
    }

    pack.clients.push(player.getUpdatePack(['hand', 'bury']));

    return pack
  });
  burying.addCallback('bury', (data, gameState) => {
    const pack = {};
    const player = gameState.getPlayerByID(data.parent);

    if (player.bury.cards.length < 2) {
      pack.err = true;
      pack.msg = 'You must bury two cards!';
      return pack
    }

    burying.toExit = true;

    return pack
  });

  burying.nextState = 'playing';

  return burying
}

module.exports = createBuryingState;
