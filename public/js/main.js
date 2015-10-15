var socket = io();
var form = document.getElementsByTagName('form')[0];
form.addEventListener('submit', emitMsg);

function emitMsg(e){
  console.log("emit me");
  e.preventDefault();
  var input = document.getElementById('inputBox');
  var messages= document.getElementById('messages');
  socket.emit('chat message in', input.value);
  input.value = '';
}
socket.on('chat message out', function(msg){
  console.log("chat message out");
  messages.innerHTML += ("<li>"+msg+"</li>");
});
