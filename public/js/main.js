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
  var username="marie";
  console.log("chat message out");
  messages.innerHTML += ("<p>"+msg+username+Date.now()+"</p>");
});


(function createPage() {
  console.log("this is create page");
    var req = new XMLHttpRequest();
    req.open('GET', '/posts');
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        console.log(req.responseText);
        // createPageHtml(JSON.parse(req.responseText), name);
      }
    };
    req.send();
  })();
