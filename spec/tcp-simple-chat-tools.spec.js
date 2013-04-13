if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../lib/tcp-simple-chat-tools.js"], function(tools) {
  describe("tcp-simple-chat-tools", function() {
    describe("Socket", function() { 
      var Socket = tools.Socket;
      var test;

      beforeEach(function() {
        test = new Socket("testName", {"test": "test"});
      });

      it("Creates a new Socket object", function() {
        expect(new Socket("testName", {"test": "test"})).toEqual(test);
        expect(new Socket(2, {"test": "test"})).not.toEqual(test);
        expect(new Socket("testName", {"test": "test2"})).not.toEqual(test);
      });

      it("Gets the name of a Socket object", function() {
        expect(test.getName()).toBe("testName");
      });

      it("Sets the name of a Socket object", function() {
        test.setName("newTestName");
        expect(test.getName()).toBe("newTestName");
      });

      it("Gets the connection socket object of a Socket object", function() {
        expect(test.getSocket()).toEqual({"test": "test"});
      });

      it("Sets the connection socket object of a Socket object", function() {
        test.setSocket({"test": "test2"});
        expect(test.getSocket()).toEqual({"test": "test2"});
      });
    });

    describe("generateID", function() {
      var generateID = tools.generateID;
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
        expect(1337).not.toBeUniqueIn(IDs);
      });
    });


    it("is a group of functions for use in a simple tcp chat server.", function() { 

    });
  });
});
