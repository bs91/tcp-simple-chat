if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([], function() {
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
  module.exports = Socket;
});
