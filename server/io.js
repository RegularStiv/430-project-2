const http = require('http');
const { Server } = require('socket.io');
const translatte = require('translatte');

let io;
const handleChatMessage = async (msg) => {
  console.log(msg);
  
    let translatedMessage;
  await translatte(msg, {to: 'ru'}).then(res => {
    translatedMessage = res.text;
    io.emit('chat message', `${translatedMessage}(${msg})`);
}).catch(err => {
    console.error(err);
});
};

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('chat message', handleChatMessage);
  });

  return server;
};
module.exports = socketSetup;
