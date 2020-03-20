import Client from '../Client.js';

export default function setupSocket(clients) {
  const socket = io();
  let selfID = null;

  socket.on('init', data => {
    if (data.clients) {
      data.clients.forEach(clientData => {
        const client = new Client(clientData);
        clients.set(client.id, client);
      });
    }
    if (data.selfID) {
      selfID = data.selfID;
    }
  });
  socket.on('remove', data => {
    if (data.clients) {
      data.clients.forEach(id => {
        clients.delete(id);
      });
    }
  });

  return socket;
}
