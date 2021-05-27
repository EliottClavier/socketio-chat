var express = require('express');
const path = require("path");
var app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

/* GET home page. */
app.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: path.join(__dirname, '../views') });
});

let users = [];

io.on('connection', (socket) => {
  socket.on('new_user', (user) => {
    users.push(user);

    socket.on('user_disconnect', (user) => {
      const index = users.find(u => u === user);
      users.splice(index, 1);
    });

    socket.on('message', (msg) => {
      io.emit('message', { user: user, message: msg});
    });
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = app;
