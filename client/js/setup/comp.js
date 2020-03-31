import Compositor from '../Compositor.js';
import { createGameBGLayer, createSeatLayer, createGameStateLayer, createMouseLayer } from '../layers/game.js';
import { createSpectatorBGLayer, createSpectatorLayer } from '../layers/spectator.js';

export default function setupComp(clients, game, mouse, settings) {
  const layers = [
    createGameBGLayer(settings.game, game),
    createSeatLayer(clients, game.seats, settings),
    createGameStateLayer(clients, game),
    createMouseLayer(mouse),
    createSpectatorBGLayer(settings.spec),
    createSpectatorLayer(clients),
  ]
  const comp = new Compositor();

  layers.forEach(layer => {
    comp.addLayer(layer);
  });

  return comp;
}
