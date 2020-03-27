import KeyboardManager from '../input/Keyboard.js';

export default function setupKeyboard(socket) {
  const keyboard = new KeyboardManager();
  ['keydown', 'keyup'].forEach(type => {
    keyboard.listenTo(window, type);
  });

  keyboard.addCallback('keydown', keyCode => {
    if (keyCode === 'KeyA') {
      socket.emit('addAI');
    }

    if (keyCode === 'KeyR') {
      socket.emit('resetGame');
    }
  });

  return keyboard;
}
