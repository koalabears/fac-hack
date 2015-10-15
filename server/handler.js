var fs = require('fs');
var redis = require('./redis.js');
var querystring = require('querystring');
var env = require('env2')('./config.env');
var https = require('https');
var jwt = require('jsonwebtoken');

var index = fs.readFileSync(__dirname + '/../public/html/index.html');
var indexJS = fs.readFileSync(__dirname + '/../public/js/main.js');
var indexCSS = fs.readFileSync(__dirname + '/../public/css/main.css');

var sessions = {};

var handler = function(req, res) {
  var url = req.url;
  var urlArray = url.split('/');
  console.log(url);

  if(url === '/'){
    var redirect = 'https://github.com/login/oauth/authorize' +
      '?client_id=' + process.env.clientId;
    res.writeHead(302, {
      'Content-Type': 'text/html',
      'Location':redirect
    });
    res.end();
  } else if (url === '/tempindex') {
      validate(req, res, serveMain);
  } else if(url.match(/^(\/auth\/)/)) {
      getToken(urlArray[2].split('=')[1], function(data){
        console.log('!github data! ::', data);
        // TODO: check for conflict
        setToken(data, req, res);
      });
  } else if (url === '/posts') {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      displayPosts(req,res);
  } else if (url === '/main.js') {
      res.writeHead(200, {
        'Content-Type': 'text/js'
      });
      res.end(indexJS);
    } else if (url === '/main.css') {
      res.writeHead(200, {
        'Content-Type': 'text/css'
      });
      res.end(indexCSS);
    }else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end();
  }
};

function setToken(gitToken, req, res){
  var cookie = Math.floor(Math.random() * 100000000);
  var access_token = gitToken.split('=')[1].split('&')[0];
  sessions[cookie] = access_token;
  redis.userId(access_token, function(id) {
    var token = jwt.sign({
      auth: id,
      agent: req.headers['user-agent'],
      exp: Math.floor(new Date().getTime()/1000)+7*24*3600
    }, process.env.jwtSecret);
    res.writeHead(302, {
      'Content-Type': 'text/html',
      'authorization': token,
      'Location': '/tempindex'
    });
    res.end();
  });
}

function validate(req, res, callback){
  var token = req.headers.authorization;
  console.log(token);
  callback(req, res);
  // var decoded = verify(token);
  // if(!decoded || !decoded.auth){
  //   authFail
// }
}

function serveMain(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}

function displayPosts(req,res){
  redis.getAllQuestions(function(out) {
      var database=JSON.stringify(out);
      res.end(database);
  });
}

var getToken = function(code, callback){
  var postData = querystring.stringify({
    client_id: process.env.clientId,
    client_secret: process.env.clientSecret,
    code: code
  });

  var options = {
    hostname: 'github.com',
    path: '/login/oauth/access_token' ,
    method: 'POST'
  };

  var req = https.request(options, function(res){
    console.log('github return statusCode: ' + res.statusCode);
    var body = '';
    res.on('data', function(chunk){
      body += chunk;
    });
    res.on('end', function(){
      callback(body);
    });
  });
  req.end(postData);
};

module.exports = handler;
