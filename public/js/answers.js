(function createAnswersPage() {
  console.log("work?");
    var req = new XMLHttpRequest();
    req.open('GET', '/question\/');
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        console.log("hello world");
        console.log(req);
        // console.log(JSON.parse(req.responseText));
        // createAnswersPageHtml(JSON.parse(req.responseText));
      }
    };
    req.send();
  })();

  function createAnswersPageHtml(data){
    console.log("hello mum");
    var question ="<div>";
    // question +=
    for (i = data.length-1; i >= 0; i--) {
    // for(i=0;i<=data.length;i++){"
      question += "<div class=q id=q" + i + "><a href='/question" + i+"'>" + data[i].question + "</a><br></div>";
      question += "<div class=details" + ">"+  "Username: " + data[i].name + "<br>" + "Date: " + data[i].date + "<br><br></div>";
      // question += "<div class=details" + ">" "<br></div>";
     }
     question += "</div>";
      qAll.innerHTML = question;
  }
