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
      getToken(urlArray[2].split('=')[1], function(data){
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
  var options = {
    hostname: 'https://github.com',
    port: 443,
    path: '/login/oauth/access_token?client_id=' + process.env.clientId +
      '&client_secret=' + process.env.clientSecret + '&code=' + code,
    method: 'POST'
  };
  var req = http.request(options, function(res){
    var body = '';
    res.on('data', function(chunk){
      body += chunk;
    });
    res.on('end', function(){
      callback(body);
    });
  });
};

module.exports = handler;
