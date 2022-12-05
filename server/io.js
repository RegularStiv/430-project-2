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
  if(data.id){
    let translatedMessage;
  await translatte(data.msg, {to: data.lang}).then(res => {
    translatedMessage = res.text;
    io.emit(data.id, `${translatedMessage}(${data.msg})`);
}).catch(err => {
    console.error(err);
});
  }else{
    io.emit('chat message', 'waiting for someone to appear... chat message prevented')
  }
};

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);

  io.on('connection', (socket) => {
    //if there is a lobby to join join in
    if(waiting === undefined){
       waiting = socket;
       console.log(lobbies);
       socket.emit('chat message', 'you have joined a lobby')
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
        socket.emit('chat message', 'Waiting For Someone To Join');
    }
    console.log('a user connected');
    socket.on('reconnect', () => {
      if(waiting === undefined){
        waiting = socket;
        console.log(lobbies);
        socket.emit('chat message', 'you have joined a lobby')
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
         socket.emit('chat message', 'Waiting For Someone To Join');
     }
    });
    socket.on('disconnect', () => {
      if(socket === waiting){
        waiting = undefined;
      }
      console.log('a user disconnected');
      socket.emit('chat message');
    });
    
    socket.on('chat message', handleChatMessage);

    socket.on('matchmaking', (obj) => {
    if(obj.command === 'remove'){
      if(!lobbies[obj.id]){
        return;
      }
      if(socket === lobbies[obj.id].person1){
        lobbies[obj.id].person1 = undefined;
        socket.emit('chat message', 'you have disconnected');
        lobbies[obj.id].person2.emit('chat message', 'the other user has disconnected');
        delete lobbies[obj.id];
        console.log(lobbies);
      }
      else{
        socket.id = undefined;
        lobbies[obj.id].person2 = undefined;
        socket.emit('matchmaking', undefined);
        socket.emit('chat message', 'you have disconnected');
        lobbies[obj.id].person1.emit('chat message', 'the other user has disconnected');
        delete lobbies[obj.id];
        //id = nothing
        console.log(lobbies);
      }
    }

  });
  console.log(lobbies);
  });
  
  return server;
};
module.exports = socketSetup;
