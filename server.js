const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const path = require('path');

let allMessages = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  let username = '';

  socket.on('set username', (name) => {
    username = name;
    socket.emit('chat history', allMessages);
    socket.broadcast.emit('chat message', `🔵 ${username} a rejoint le chat`);
  });

  socket.on('chat message', (msg) => {
    const message = `${username} : ${msg}`;
    allMessages.push(message);
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    if (username) {
      io.emit('chat message', `🔴 ${username} a quitté le chat`);
    }
  });
});

http.listen(3000, () => {
  console.log('Serveur de chat lancé sur http://localhost:3000');
});
