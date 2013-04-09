var net = require('net');
var server = net.createServer();

function Socket(name, socket) {
  this.name = name;
  this.socket = socket;
}

Socket.prototype = {
  constructor: Socket,
  getName:function() {
    return this.name;
  },
  setName:function(newName) {
    this.name = newName;
  },
  getSocket:function() {
    return this.socket;
  },
  setSocket:function(newSocket) {
    this.socket = newSocket;
  }
}
var sockets = {};

function broadcast(socket, sockets, writeData, excludeSelf) {
  Object.keys(sockets).forEach(function(id){
    if (excludeSelf) {
      if (sockets[id].getSocket() !== socket) {
        sockets[id].getSocket().write(writeData);
      }
    }
    else {
      sockets[id].getSocket().write(writeData);
    }
  });
}

function userCommand(cmd, socket, sockets, id) {
  var params = [];
  if (cmd.indexOf(" ") !== -1) {
    params = cmd.split(" ");
    cmd = params.shift();
  }
  switch (cmd.toString().toLowerCase().trim()) {
    case "help":
      socket.write("nickname <newNick> (changes nickname to new nickname), users (prints a list of who is currently online)\n");
      break;
    case "nickname":
      if (params[0]) {
        sockets[id].setName(params[0].toString().trim());
      }
      else {
        socket.write("You must supply a new nickname, no change has occured.\n");
      }
      break;
    case "users":
      Object.keys(sockets).forEach(function(id) {
        socket.write(sockets[id].getName().toString() + "\n");
      });
      break;
    default:
      socket.write("That isn't a valid command, try help for a list of commands.\n");
  }
}

function generateID() { 
  var date = new Date();
  var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];
  return components.join("");
}

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
