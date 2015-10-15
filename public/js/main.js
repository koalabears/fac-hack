var socket = io();
var form = document.getElementsByTagName('form')[0];
var qAll=document.getElementById('questionsAll');
form.addEventListener('submit', emitMsg);

var token = window.location.search.split('=')[1];
// window.history.pushState(“string”, auth, “/#”);

function emitMsg(e){
  e.preventDefault();
  var input = document.getElementById('inputBox');
  var newQ = document.getElementById('newQ');
  socket.emit('question in', input.value);
  input.value = '';
}
socket.on('question out', function(msg){
  var username="marie";
  newQ.innerHTML = ("<div class=newDet>" + "Username: " + username + "<br>" + "Date: " + Date.now() + "</div>")+newQ.innerHTML;
  newQ.innerHTML = ("<div id=new> <a href='/question" + "'>"  + msg + "</a></div>")+newQ.innerHTML;

});


(function createPage() {
    var req = new XMLHttpRequest();
    req.open('GET', '/posts?'+token);
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        createPageHtml(JSON.parse(req.responseText));
      }
    };
    req.send();
  })();

function createPageHtml(data){
  var question ="<div>";
  // question +=
  for (i = data.length-1; i >= 0; i--) {
  // for(i=0;i<=data.length;i++){"
    question += "<div class=q id=q" + i + "><a href='/question" + data[i].id +"'>" + data[i].question + "</a><br></div>";
    question += "<div class=details" + ">"+  "Username: " + data[i].name + "<br>" + "Date: " + data[i].date + "<br><br></div>";
    // question += "<div class=details" + ">" "<br></div>";
   }
   question += "</div>";
    qAll.innerHTML = question;
}
