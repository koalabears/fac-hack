var socket = io();
document.getElementsByTagName('form')[0].addEventListener('submit', emitMsg);


var emitMsg = function(e){
  console.log("emit me");
  e.preventDefault();
  var input = document.getElementById('inputBox');
  var messages= document.getElementById('messages');
  socket.emit('chat message in', input.value);
  input.value = '';
};
socket.on('chat message out', function(msg){
  messages.innerHTML += ("<li>"+msg+"</li>");
});
