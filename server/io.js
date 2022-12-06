const http = require('http');
const { Server } = require('socket.io');
const translatte = require('translatte');
// const { object } = require('underscore');
const { v4: uuidv4 } = require('uuid');

const lobbies = {};

let waiting;
let io;
const handleChatMessage = async (data, socket) => {
  if (data.id) {
    let translatedMessage;
    await translatte(data.msg, { to: data.lang }).then((res) => {
      translatedMessage = res.text;
      io.emit(data.id, `${socket.request.session.account.username}: ${translatedMessage} (${data.msg})`);
    }).catch((err) => {
      console.error(err);
    });
  } else {
    io.emit('chat message', 'SERVER: Waiting for someone to appear... chat message prevented');
  }
};

const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

const socketSetup = (app, sessionMiddleWare) => {
  const server = http.createServer(app);
  io = new Server(server);
  io.use(wrap(sessionMiddleWare));

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      if (socket === waiting) {
        waiting = undefined;
      }
    });

    socket.on('chat message', (data) => {
      handleChatMessage(data, socket);
    });

    socket.on('matchmaking', (obj) => {
      if (obj.command === 'remove') {
        if (!lobbies[obj.id]) {
          return;
        }
        if (socket === lobbies[obj.id].person1) {
          lobbies[obj.id].person1 = undefined;
          socket.emit('matchmaking', {
            command: 'remove',
            id: undefined,
          });
          socket.emit('chat message', 'SERVER: you have disconnected');
          lobbies[obj.id].person2.emit('chat message', 'SERVER: the other user has disconnected');
          delete lobbies[obj.id];
        } else {
          // socket.id = undefined;
          lobbies[obj.id].person2 = undefined;
          socket.emit('matchmaking', {
            command: 'remove',
            id: undefined,
          });
          socket.emit('chat message', 'SERVER: you have disconnected');
          lobbies[obj.id].person1.emit('chat message', 'SERVER: the other user has disconnected');
          delete lobbies[obj.id];
        }
        if (socket === waiting) {
          waiting = undefined;
        }
      } else if (obj.command === 'reconnect') {
        if (waiting === undefined) {
          waiting = socket;
          socket.emit('chat message', 'SERVER: Waiting to find another person');
        } else { // create lobby if there is no lobby
        // create number
        // prevents being connected to self
          if (socket === waiting) {
            return;
          }
          const id = uuidv4();
          socket.emit('matchmaking', {
            command: 'reconnect',
            id,
          });
          waiting.emit('matchmaking', {
            command: 'reconnect',
            id,
          });

          lobbies[id] = {
            person1: socket,
            person2: waiting,
          };
          waiting = undefined;
          lobbies[id].person1.emit('chat message', 'SERVER: You have been connected to another person!');
          lobbies[id].person2.emit('chat message', 'SERVER: You have been connected to another person!');
        }
      }
    });
  });
  return server;
};
module.exports = socketSetup;
