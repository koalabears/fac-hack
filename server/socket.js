var redis = require('./redis.js');
var socketio = require('socket.io');

var io;

function attachServer(server) {
  io = socketio(server);
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
    var data = JSON.parse(msg);
    var obj = {
      question: data.text,
      name: data.userName,
      date: Date.now()
    };
    redis.postQuestion(obj, function(data) {
    console.log("posting question");
    console.log(data);
    io.emit('question out', data);

    });
    redis.getAllQuestions(function(out) {
      console.log("getting questions");

    });
    console.log('message: ',msg);

// emitting an event to al the sockets
  });
  socket.on('answer in',function(answer, url){
    console.log(url);
    //catching an event unique to this socket
    //send to REDIS
    var obj = {
      answer: answer,
      name: "naaz",
      date: Date.now(),
      url: url
    };
    redis.postAnswer(obj, function(data) {
    console.log("posting answer");
    console.log(data);
    io.emit('answer out', data.answer);

    });
    redis.getAllAnswers(function(out) {
      console.log("getting answers");

    });
    console.log('message: ',answer);

  // emitting an event to al the sockets
  });


}

module.exports = attachServer;
