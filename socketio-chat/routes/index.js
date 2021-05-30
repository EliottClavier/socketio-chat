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
    io.emit('users', { users: users });
    io.emit('connected', { user: user });

    socket.on('user_disconnect', (user) => {
      users.splice(users.indexOf(user), 1);
      io.emit('users', { users: users });
      io.emit('disconnected', { user: user });
      socket.off('new_user', () => {
        console.log("Déconnexion : ", user)
      });
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
