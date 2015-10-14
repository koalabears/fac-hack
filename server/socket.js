var io;

function attachServer(server) {
  io = require('socket.io')(server);
  io.on('connection', manageConnection);
}
//io emits event 'connection'

function manageConnection(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message in',function(msg){
    //catching an event unique to this socket
    console.log('message: ',msg);
    io.emit('chat message out', msg);
// emitting an event to al the sockets
  });
}

module.exports = attachServer;
