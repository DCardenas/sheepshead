import Compositor from '../Compositor.js';
import { createGameBGLayer, createSeatLayer } from '../layers/game.js';
import { createSpectatorBGLayer, createSpectatorLayer } from '../layers/spectator.js';

export default function setupComp(clients, seats, settings) {
  const layers = [
    createGameBGLayer(settings.game),
    createSeatLayer(clients, seats, settings),
    createSpectatorBGLayer(settings.spec),
    createSpectatorLayer(clients)
  ]
  const comp = new Compositor();

  layers.forEach(layer => {
    comp.addLayer(layer);
  });

  return comp;
}
