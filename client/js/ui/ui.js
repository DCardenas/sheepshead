import buildStatesUI from './states.js';

export default function createUI(socket, game) {
  const ui = {};

  ui.redraw = true;

  ui.states = buildStatesUI(socket, game)

  ui.update = () => {
    const state = game.getUI();
    state.update(game);

    ui.redraw = true;
  }

  return ui;
}
