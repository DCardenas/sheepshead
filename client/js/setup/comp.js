import Compositor from '../Compositor.js';
import { createGameBGLayer, createSeatLayer, createGameStateLayer } from '../layers/game.js';
import { createSpectatorBGLayer, createSpectatorLayer } from '../layers/spectator.js';

export default function setupComp(clients, seats, settings, gameState) {
  const layers = [
    createGameBGLayer(settings.game),
    createSeatLayer(clients, seats, settings),
    createGameStateLayer(clients, seats, gameState),
    createSpectatorBGLayer(settings.spec),
    createSpectatorLayer(clients)
  ]
  const comp = new Compositor();

  layers.forEach(layer => {
    comp.addLayer(layer);
  });

  return comp;
}
