var aAll = document.getElementById('answersAll');
var questionId =window.location.pathname;
createAnswersPage();

function createAnswersPage(questionId) {
  console.log("im' being run");
    var req = new XMLHttpRequest();
    req.open('GET', '/answers');
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        console.log("yo");
        // console.log(JSON.parse(req.responseText));
        createAnswersPageHtml(JSON.parse(req.responseText));
      }
    };
    req.send();
  }

function createAnswersPageHtml(data){
  console.log("creating page");
    var answer ="<div>";
    // question +=
    for (i = data.length-1; i >= 0; i--) {
      var qNo=data[i].url;
      console.log(qNo);
      console.log(questionId);
      if (qNo==questionId){
    // for(i=0;i<=data.length;i++){"
      answer += "<div class=a id=a" + i + ">" + data[i].answer + "<br></div>";
      answer += "<div class=details" + ">"+  "Username: " + data[i].name + "<br>" + "Date: " + data[i].date + "<br><br></div>";
      // question += "<div class=details" + ">" "<br></div>";
     }
     answer += "</div>";
      aAll.innerHTML = answer;
  }
}

var socket = io();
var answersForm = document.getElementsByTagName('form')[0];
var answersAll = document.getElementById('answersAll');

answersForm.addEventListener('submit', emitAnswer);

function emitAnswer(e){
  e.preventDefault();
  var input = document.getElementById('inputBox');
  var newQ = document.getElementById('newA');
  socket.emit('answer in', input.value, window.location.pathname);
  input.value = '';
}
socket.on('answer out', function(msg){
  var username="naaz";
  newA.innerHTML = ("<div class=newDet>" + "Username: " + username + "<br>" + "Date: " + Date.now() + "</div>")+newA.innerHTML;
  newA.innerHTML = ("<div id=new>" + msg + "</div>")+newA.innerHTML;
});

console.log("hello");
