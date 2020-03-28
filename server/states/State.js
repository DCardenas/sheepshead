function hoverCard(data, gameState) {
  data.player.hoverCard(data.id, data.hover);

  return {
    clients: [
      data.player.getUpdatePack(['hand'])
    ]
  }
}

function stand(data, gameState) {
  // Clear out player's hand first
  data.player.hand.clear();

  const pack = {
    stand: {
      seat: data.player.seat
    }
  }

  // Add options for what happens if someone leaves during a game
  // 30 sec buffer to rejoin
  // Allow anyone to take seat
  // Etc

  gameState.stand(data.player.seat);

  if (data.player.dealer) {
    gameState.determineDealer();

    pack.game = {
      dealer: gameState.dealer
    }
  }

  if (gameState.stateManager.activeState.name !== 'pregame') {
    gameState.stateManager.nextState = 'pregame';
    gameState.stateManager.activeState.toExit = true;
  }

  return pack
}

class State {
  constructor(name) {
    this.name = name;
    this.callbacks = new Map();

    if (name !== 'pregame') {
      this.addCallback('hover', hoverCard);
    }

    this.addCallback('stand', stand);
  }

  enter() {
    return null
  }

  exit() {
    return null
  }

  addCallback(type, callback) {
    this.callbacks.set(type, callback);
  }

  handleEvent(type, data, gameState) {
    if (!this.callbacks.has(type)) {
      return { error: true, msg: 'Tried to fire event ' + type + ' which has no callbacks.' }
    }


    return this.callbacks.get(type)(data, gameState);
  }
}

module.exports = State;
