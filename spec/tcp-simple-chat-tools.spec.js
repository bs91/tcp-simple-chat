if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../lib/tcp-simple-chat-tools.js"], function(tools) {
  describe("tcp-simple-chat-tools", function() {
    var Socket = tools.Socket;
    var generateID = tools.generateID;
    var broadcast = tools.broadcast;
    var userCommand = tools.userCommand;
    
    var test;    
    var socket;
    var sockets = {};
    var writeData;

    beforeEach(function() {
      test = new Socket("testName", {"testProp": "testVal"}); 
      socket = test;
      sockets[generateID()] = test;
      sockets[generateID()] = new Socket("test2", {"test2Prop": "test2Val"});
      writeData = "Random string test data."
    });
    
    describe("Socket", function() { 

      it("Creates a new Socket object", function() {
        expect(new Socket("testName", {"testProp": "testVal"})).toEqual(test);
        expect(new Socket(2, {"testProp2": "testVal"})).not.toEqual(test);
        expect(new Socket("testName", {"testProp": "testVal2"})).not.toEqual(test);
      });

      it("Gets the name of a Socket object", function() {
        expect(test.getName()).toBe("testName");
      });

      it("Sets the name of a Socket object", function() {
        test.setName("newTestName");
        expect(test.getName()).toBe("newTestName");
      });

      it("Gets the connection socket object of a Socket object", function() {
        expect(test.getSocket()).toEqual({"testProp": "testVal"});
      });

      it("Sets the connection socket object of a Socket object", function() {
        test.setSocket({"test": "test2"});
        expect(test.getSocket()).toEqual({"test": "test2"});
      });
    });

    describe("generateID", function() {
      var IDs = [];
      var testIDs = 100;
      var notUniqueID = 1337;

      it("generates a unique string of numbers for use as an ID", function() {
        this.addMatchers({
          toBeUniqueIn: function(expected) {
            var actual = this.actual
            var notText = this.isNot ? " not" : "";

            this.message = function() {
              return "Expected " + actual + notText + " to be unique in " + expected;
            }
            
            return expected.every(function(item) {
                return item !== actual;
              });
            }
          });
        
        while(IDs.length < testIDs) {
          IDs.push(generateID());
        }
        
        IDs.push(notUniqueID);

        expect(generateID()).toBeUniqueIn(IDs);
        expect(notUniqueID).not.toBeUniqueIn(IDs);
      });
    });

    describe("broadcast", function() {
      beforeEach(function() {
        broadcast = jasmine.createSpy("broadcast() spy").andCallFake(function(socket, sockets, writeData, excludeSelf) {
          return [writeData, excludeSelf];
        });
      });
      
      it("emits a message to all available sockets", function() {
        expect(broadcast(socket, sockets, writeData, false)[0]).toEqual("Random string test data.");
        expect(broadcast(socket, sockets, writeData, false)[1]).toBeFalsy();
      });

      it("emits a message to all available sockets excluding self", function() {
        expect(broadcast(socket, sockets, writeData, true)[0]).toEqual("Random string test data.");
        expect(broadcast(socket, sockets, writeData, true)[1]).toBeTruthy();
      });
    });

    describe("userCommand", function() {

      beforeEach(function() {
        userCommand = jasmine.createSpy("userCommand() spy").andCallFake(function(cmd, socket, sockets, id) {
          return [cmd, id];
        });
      });

      it("takes a command and performs an action based on which you send in.", function() {
        expect(userCommand("help", socket, sockets, 1337)).not.toEqual(userCommand("nickname", socket, sockets, generateID()));
        expect(userCommand("help", socket, sockets, generateID())).not.toEqual(userCommand("", socket, sockets, generateID()));
        expect(userCommand("help", socket, sockets, 1337)).toEqual(userCommand("help", socket, sockets, 1337));
      });
    });

    it("is a group of functions for use in a simple tcp chat server.", function() { 
      expect(tools).toBeDefined();
    });
  });
});
