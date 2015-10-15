var fs = require('fs');
var redis = require('./redis.js');
var querystring = require('querystring');
var env = require('env2')('./config.env');
var https = require('https');

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
  // } else if(url.match(/^(\/auth\/)/)) {
  //   // console.log('request object in auth endpoint: ', req);
  //   // res.end('Your have logged in!!');
  //   //
  //   // console.log('inside auth endpoint in handler');
  //     getToken(urlArray[2].split('=')[1], function(data){
  //       console.log('now in final callback!!');
  //       console.log('data', data);
  //       res.end(data);
  //     });

    //   getToken(urlArray[2].split('=')[1], function(data){
    //     console.log('now in final callback!!');
    //     console.log('data', data);
    //     res.end(data);
    //   });
  } else if (url === '/tempindex') {
    console.log('posts end point');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(index);
  } else if(url.match(/^(\/auth\/)/)) {
      getToken(urlArray[2].split('=')[1], function(data){
        // TODO: check for conflict
        var cookie = Math.floor(Math.random() * 100000000);
        var access_token = data.split('=')[1].split('&')[0];
        sessions[cookie] = access_token;
        res.writeHead(200, {
          "Set-Cookie": 'access=' + cookie
        });
        res.end('logged in!, access_token = ' + sessions[cookie]);
      });
  } else if (url === '/posts') {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      displayPosts(req,res);
  } else if (url === '/main.js') {
    console.log("this is frontend js");
      res.writeHead(200, {
        'Content-Type': 'text/js'
      });
      res.end(indexJS);
    } else if (url === '/main.css') {
    console.log("this is frontend css");
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

function displayPosts(req,res){
  console.log('this is display posts');
  // res.write(index1);
  redis.getAllQuestions(function(out) {
      var database=JSON.stringify(out);
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
