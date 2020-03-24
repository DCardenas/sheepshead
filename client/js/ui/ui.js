import { buildPregameUI, buildPickingUI } from '../states/states.js';

export default function createUI(socket, settings) {
  const ui = {};

  ui.states = {
    pregame: buildPregameUI(socket, settings),
    picking: buildPickingUI(socket, settings),
  }

  return ui;
}
