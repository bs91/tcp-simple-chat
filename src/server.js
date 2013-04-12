var net = require('net');
var server = net.createServer();
var Socket = require("../lib/tcp-simple-chat-tools.js").Socket;
var generateID = require("../lib/tcp-simple-chat-tools.js").generateID;
var broadcast = require("../lib/tcp-simple-chat-tools.js").broadcast;
var userCommand = require("../lib/tcp-simple-chat-tools.js").userCommand;

var sockets = {};

server.on('connection', function(socket) {
  console.log('got a new connection');

  var id = generateID();

  sockets[id] = new Socket('user' + id, socket);

  broadcast(socket, sockets,  sockets[id].getName() + " has connected!\n", false);
  socket.write("You can issue commands with cmd: <command>, try help for a list of available commands.\n");
  socket.on('data', function(data) {
    console.log(sockets[id].getName() + ': ' +  data.toString());
    if(data.toString().indexOf('cmd: ') === 0) {
      var command = data.toString().substring(5);
      userCommand(command, socket, sockets, id);
      return
    }
    broadcast(socket, sockets, sockets[id].getName() + ": " +  data, true);
  });
  
  socket.on('close', function() {
    console.log('connection closed');
    broadcast(socket, sockets, sockets[id].getName() + " has disconnected!\n", false);
    delete sockets[id];
  });

  socket.on('error', function(err) {
    console.log(err.message);
  });
});

server.on('error', function(err) {
  console.log('Server error:', err.message);
});

server.on('close', function() {
  console.log('Server closed');
});

server.listen(4001);
