if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function() {
  var exports = {};

  // Description: Socket Class
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

  exports.Socket = Socket;
 
  // Description: Generates a unique ID.
  // Get the current timestamp down to miliseconds multiply it by a random number, multiply that by hex 4096, convert the result to hex string.
  function generateID() { 
    var uniqueID;
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
    uniqueID = parseInt(components.join(""));
    uniqueID = (uniqueID * ((1 + Math.random()) * 0x10000)).toString(16); 
    return uniqueID;
  }

  exports.generateID = generateID;
  
  // Description: Broadcasts a message to all available sockets unless told to ignore self. 
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

  exports.broadcast = broadcast;

  // Description: 
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

  exports.userCommand = userCommand;

  return exports; 
});
