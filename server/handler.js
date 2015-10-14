var fs = require('fs');
var index = fs.readFileSync(__dirname + '/../public/html/index.html');
var env = require('env2')('./config.env');
var http = require('http');

console.log(process.env.clientId);

var handler = function(req, res){
  var url = req.url;
  var urlArray = url.split('/');
  console.log(url);
  if(url === '/'){
    var idStr = '?client_id=' + process.env.clientId;
    var redirStr = '&redirect_uri=' + 'https://google.com';
    var redirect = 'https://github.com/login/oauth/authorize'+ idStr;
    res.writeHead(302, {
      'Content-Type': 'text/html',
      'Location':redirect
    });
    res.end();
  } else if(url.match(/^(\/auth\/)/)) {
    // console.log('request object in auth endpoint: ', req);
    // res.end('Your have logged in!!');
    //
    // console.log('inside auth endpoint in handler');
      getToken(urlArray[2].split('=')[1], function(data){
        console.log('now in final callback!!');
        console.log('data', data);
        res.end(data);
      });
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end();
  }
};

var getToken = function(code, callback){
  console.log('getToken called');
  console.log('code', code, '*******');
  console.log('p env', process.env);
  var postData = JSON.stringify({
    client_id: process.env.clientId,
    client_secret: process.env.clientSecret,
    code: code
  });
    var options = {
    hostname: 'github.com',
    port: 80,
    path: '/login/oauth/access_token' ,
    method: 'POST'
  };
  var req = http.request(options, function(res){
    console.log('We have a reponse from github!');
    var body = '';
    res.on('data', function(chunk){
      body += chunk;
    });
    res.on('end', function(){
      console.log('github response body: ', body);
      callback(body);
    });
  });

  req.headers['Content-Type'] = 'application/json';
  req.headers['Accept'] = 'application/json';
  req.on('error', function(e){
    console.log('problem with request: ' + e.message);
  });
  req.write(postData);
  console.log('_____about to call req.end______');
  req.end();
};

module.exports = handler;
