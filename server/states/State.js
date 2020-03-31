function hoverCard(data, gameState) {
  const player = gameState.getPlayerByID(data.parent);

  if (!player) {
    return
  }

  player.hoverCard(data.id, data.hover);

  return {
    clients: [
      player.getUpdatePack(['hand'])
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

function cardSelected(data, gameState) {
  const pack = {
    clients: [],
    mouse: {}
  }

  const player = gameState.getPlayerByID(data.parent);
  const card = player[data.deck].getCardByID(data.id);

  card.oldX = card.x;
  card.oldY = card.y;

  card.x = data.pos.x;
  card.y = data.pos.y;
  card.selected = true;

  pack.clients.push(player.getUpdatePack(['hand']));
  pack.mouse.select = true;
  pack.mouse.id = data.id;
  pack.mouse.deck = data.deck;
  pack.mouse.parent = data.parent;

  return pack
}

function cardMoved(data, gameState) {
  const pack = {
    clients: [],
  }

  const player = gameState.getPlayerByID(data.parent);
  const card = player[data.deck].getCardByID(data.id);

  card.x = data.pos.x;
  card.y = data.pos.y;

  pack.clients.push(player.getUpdatePack(['hand']));

  return pack
}

function cardReleased(data, gameState) {
  const pack = {
    clients: [],
    mouse: {}
  }

  const player = gameState.getPlayerByID(data.parent);
  const card = player[data.deck].getCardByID(data.id);

  card.x = card.oldX;
  card.y = card.oldY;
  card.selected = false;

  pack.clients.push(player.getUpdatePack(['hand']));
  pack.mouse.select = false;
  pack.mouse.id = card.id;

  return pack
}

class State {
  constructor(name) {
    this.name = name;
    this.callbacks = new Map();

    if (name !== 'pregame') {
      this.addCallback('hover', hoverCard);
      this.addCallback('cardSelected', cardSelected);
      this.addCallback('cardMoved', cardMoved);
      this.addCallback('cardReleased', cardReleased);
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
