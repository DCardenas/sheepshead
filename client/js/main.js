class Client {
  constructor(data) {
    for (let key in data) {
      this[key] = data[key];
      this.seat = null;
    }
  }
}

const clients = new Map();

const socket = io();

socket.on('init', data => {
  if (data.clients) {
    data.clients.forEach(clientData => {
      const client = new Client(clientData);
      clients.set(client.id, client);
    });
  }
});

const canvas = {
  game: document.getElementById('gameCanvas'),
  spec: document.getElementById('spectatorCanvas')
}
canvas.game.width = 900;
canvas.game.height = 600;
canvas.spec.width = 240;
canvas.spec.height = 600;
const ctx = {
  game: canvas.game.getContext('2d'),
  spec: canvas.spec.getContext('2d')
}

function loop() {
  ctx.game.fillStyle = '#161648';
  ctx.game.fillRect(0, 0, canvas.game.width, canvas.game.height);

  ctx.spec.fillStyle = 'grey';
  ctx.spec.fillRect(0, 0, canvas.spec.width, canvas.spec.height);

  ctx.spec.fillStyle = 'black';
  ctx.spec.textAlign = 'left';
  ctx.spec.textBaseline = 'middle';
  ctx.spec.font = '20px Arial';
  let i = 0;
  clients.forEach(client => {
    ctx.spec.fillText(client.name, 10, i * 40 + 20);
    i++;
  })

  window.requestAnimationFrame(loop);
}

loop();
