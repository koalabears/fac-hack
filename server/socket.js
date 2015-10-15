var redis = require('./redis.js');

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
    //send to REDIS
    var obj = {
      question: msg,
      name: "marie",
      date: Date.now()
    };
    redis.postQuestion(obj, function(data) {
    console.log("posting question");
    });
    redis.getAllQuestions(function(out) {
      console.log("getting questions");
      
    });
    console.log('message: ',msg);
    io.emit('chat message out', msg);
// emitting an event to al the sockets
  });
}

module.exports = attachServer;
