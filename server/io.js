const http = require('http');
const { Server } = require('socket.io');
const translatte = require('translatte');
const { object } = require('underscore');
const { v4: uuidv4 } = require('uuid');
let lobbies = {};

let waiting = undefined;
let io;
const handleChatMessage = async (data) => {
  console.log(data);
    let translatedMessage;
  await translatte(data.msg, {to: data.lang}).then(res => {
    translatedMessage = res.text;
    io.emit(data.id, `${translatedMessage}(${data.msg})`);
}).catch(err => {
    console.error(err);
});
};

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);

  io.on('connection', (socket) => {
    //if there is a lobby to join join in
    if(waiting === undefined){
       waiting = socket;
       console.log(lobbies);
    }
    //create lobby if there is no lobby
    else {
        //create number
        const id = uuidv4();
        socket.emit('matchmaking', id);
        waiting.emit('matchmaking', id);
        
        lobbies[id] = {
          person1: socket,
          person2: waiting
        };
        waiting = undefined;
    }
    console.log('a user connected');

    socket.on('disconnect', () => {
      if(socket === waiting){
        waiting = undefined;
      }
      console.log('a user disconnected');
    });

    socket.on('chat message', handleChatMessage);

    socket.on('matchmaking', (obj) => {
    if(obj.command === 'disconnect'){
      if(socket === lobbies[obj.id].person1){
        lobbies[obj.id].person1 = undefined;
        socket.emit('matchmaking', 'you have disconnected');
        lobbies[obj.id].person2.emit('matchmaking', 'the other user has disconnected');
      }
      else{
        lobbies[obj.id].person2 = undefined;
        socket.emit('matchmaking', 'you have disconnected');
        lobbies[obj.id].person1.emit('matchmaking', 'the other user has disconnected');
      }
        
    }
      console.log('a user disconnected');
  });
  });
  
  return server;
};
module.exports = socketSetup;
