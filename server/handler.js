var fs = require('fs');
var redis = require('./redis.js');
var querystring = require('querystring');
var env = require('env2')('./config.env');
var https = require('https');
var jwt = require('jsonwebtoken');

var index = fs.readFileSync(__dirname + '/../public/html/index.html');
var answers = fs.readFileSync(__dirname + '/../public/html/answers.html');
var indexJS = fs.readFileSync(__dirname + '/../public/js/main.js');
var answersJS = fs.readFileSync(__dirname + '/../public/js/answers.js');
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

  } else if (url.match(/^(\/tempindex)/)) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
      // validate(req, res, serveMain);
  } else if(url.match(/^(\/auth\/)/)) {
      getToken(urlArray[2].split('=')[1], function(data){
        // TODO: check for conflict
        setToken(data, req, res);
      });
    } else if (url==='/posts') { //remove this else if later
      console.log("handler");
      res.writeHead(200, {'Content-Type': 'text/html'});
      displayPosts(req,res);
  } else if (url.match(/^(\/posts)/)) {
    console.log("handler");
      validate(req, res, function(){
        displayPosts(req,res);
      });
    } else if (url.match(/^(\/question)/)) {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.end(answers);
      } else if (url=== '/answers'){
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          displayAnswers(req,res);
  } else if (url === '/main.js') {
      res.writeHead(200, {
        'Content-Type': 'text/js'
      });
      res.end(indexJS);
    } else if (url === '/answers.js') {
        res.writeHead(200, {
          'Content-Type': 'text/js'
        });
        res.end(answersJS);
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
    console.log('redirect! ', token);
    res.writeHead(302, {
      'Content-Type': 'text/html',
      'Location': '/tempindex?token='+token
    });
    res.end();
  });
}


function validate(req, res, callback){
  var token = req.url.split('?')[1];
  console.log('*************');
  console.log(process.env.jwtSecret);

  // var decoded = verify(token);
  if (verify(token)) {
    var decoded = jwt.decode(token);
    console.log(decoded);
    callback(req, res);
  } else {
    res.end('nah mate!');
  }

  // jwt.decode(process.env.jwtSecret, token, function (err_, decode) {
  //      if (err) {
  //          return console.error(err.name, err.message);
  //      } else {
  //          console.log(decode);
  //
  //      }
  //  });
  // console.log(decoded);
  // if(!decoded || !decoded.auth){
  //   authFail
// }
}

function verify(token) {
  var decoded = false;
  try {
    decoded = jwt.verify(token, process.env.jwtSecret);
  } catch (e) {
    decoded = false; // still false
  }
  return decoded;
}

function serveMain(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}


function displayPosts(req,res){
  console.log("displayPosts is here");
  redis.getAllQuestions(function(out) {
      var database=JSON.stringify(out);
      console.log(out);
      res.end(database);
  });
}

function displayAnswers(req,res){
  console.log("displaying answers");
  redis.getAllAnswers(function(out) {
      var database=JSON.stringify(out);
      // console.log('ans out:', );
        res.end(database);
  });
}

var getToken = function(code, callback){
  console.log('gitHub code: \"'+code+"\"");
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
      // var access_token = ;
      // function setCookie() {
      //   var rnd = Math.floor(Math.random() * 100000000);
      //   if (!sessions[rnd]) sessions[rnd] = access_token;
      //   else setCookie();
      // }
      callback(body);
    });
  });
  req.end(postData);
};

module.exports = handler;
