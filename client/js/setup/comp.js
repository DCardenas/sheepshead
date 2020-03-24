import Compositor from '../Compositor.js';
import { createGameBGLayer, createSeatLayer, createGameStateLayer } from '../layers/game.js';
import { createSpectatorBGLayer, createSpectatorLayer } from '../layers/spectator.js';

export default function setupComp(clients, game, settings) {
  const layers = [
    createGameBGLayer(settings.game, game),
    createSeatLayer(clients, game.seats, settings),
    createGameStateLayer(clients, game),
    createSpectatorBGLayer(settings.spec),
    createSpectatorLayer(clients)
  ]
  const comp = new Compositor();

  layers.forEach(layer => {
    comp.addLayer(layer);
  });

  return comp;
}
