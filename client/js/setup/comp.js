import createSpectatorCompositor from '../layers/spectator.js';
import createGameCompositor from '../layers/game.js';

export default function setupComp(clients, seats, selfID, gameSettings, specSettings) {
  const comp = {
    game: createGameCompositor(clients, seats, selfID, gameSettings),
    spec: createSpectatorCompositor(clients, specSettings),
  }

  return comp;
}
