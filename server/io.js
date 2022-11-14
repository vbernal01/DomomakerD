const http = require('http');

const { Server } = require('socket.io');

let io;

const addCommunityDomo = (domoList) => {
  io.emit('addDOM', domoList);
};

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('addDomo', addCommunityDomo);
  });

  return server;
};

// We only export the one function from this file, just like in router.js
module.exports = socketSetup;
