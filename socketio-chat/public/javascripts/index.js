let socket = io();
let connection = document.getElementById('connection');
let connected = document.getElementById('connected');
let user = document.getElementById('user');
let user_form = document.getElementById('user_form');
let disconnect_form = document.getElementById('disconnect_form');
connected.hidden = true;

let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

const buildMessage = (name, string) => {
  let span = document.createElement('span');
  span.className = name;
  span.textContent = string;
  return span;
}

const switchView = () => {
  connection.classList.toggle("d-flex");
  connection.hidden = !connection.hidden;
  connected.classList.toggle("d-flex");
  connected.hidden = !connected.hidden;
}

user_form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (user.value) {
    socket.emit('new_user', user.value);
    switchView();
  }
});

disconnect_form.addEventListener('submit', function(e) {
  e.preventDefault();
  socket.emit('user_disconnect', user.value);
  user.value = '';
  switchView();
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('message', input.value);
    input.value = '';
  }
});

socket.on('message', function(obj) {
  var item = document.createElement('li');
  let user = buildMessage('user', obj.user + ' - ');
  let msg = buildMessage('message', obj.message);
  item.appendChild(user);
  item.appendChild(msg);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
