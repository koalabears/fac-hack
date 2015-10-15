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
  socket.on('question in',function(msg){
    //catching an event unique to this socket
    //send to REDIS
    var obj = {
      question: msg,
      name: "marie",
      date: Date.now()
    };
    redis.postQuestion(obj, function(data) {
    console.log("posting question");
    io.emit('question out', data);

    });
    redis.getAllQuestions(function(out) {
      console.log("getting questions");

    });
    console.log('message: ',msg);

// emitting an event to al the sockets
  });
}

module.exports = attachServer;
