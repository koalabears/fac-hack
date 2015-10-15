var socket = io();
var form = document.getElementsByTagName('form')[0];
var qAll=document.getElementById('questionsAll');
form.addEventListener('submit', emitMsg);

function emitMsg(e){
  console.log("emit me");
  e.preventDefault();
  var input = document.getElementById('inputBox');
  var newQ = document.getElementById('newQ');
  socket.emit('chat message in', input.value);
  input.value = '';
}
socket.on('chat message out', function(msg){
  var username="marie";
  console.log("chat message out");
  newQ.innerHTML += ("<div id=new> " + msg + "</div>");
  newQ.innerHTML += ("<div class=newDet>" + "Username: " + username + "<br>" + "Date: " + Date.now() + "</div>");
});


(function createPage() {
  console.log("this is create page");
    var req = new XMLHttpRequest();
    req.open('GET', '/posts');
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        console.log(JSON.parse(req.responseText));
        createPageHtml(JSON.parse(req.responseText));
      }
    };
    req.send();
  })();

function createPageHtml(data){
  var question ="<div>";
  // question +=
  for (i = data.length-1; i >= 0; i--) {
  // for(i=0;i<=data.length;i++){
    question += "<div class=q id=q" + i + ">"+ data[i].question + "<br></div>";
    question += "<div class=details" + ">"+  "Username: " + data[i].name + "<br>" + "Date: " + data[i].date + "<br><br></div>";
    // question += "<div class=details" + ">" "<br></div>";
   }
   question += "</div>";
    qAll.innerHTML = question;
}
