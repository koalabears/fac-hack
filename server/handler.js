var fs = require('fs');
var redis = require('./redis.js');
var index1 = fs.readFileSync(__dirname + '/../public/html/index1.html');
var index2 = fs.readFileSync(__dirname + '/../public/html/index2.html');
var index = fs.readFileSync(__dirname + '/../public/html/index.html');

var indexJS = fs.readFileSync(__dirname + '/../public/js/main.js');

var env = require('env2')('./config.env');
var http = require('http');

console.log(process.env.clientId);

var handler = function(req, res) {
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
  } else if (url === '/posts') {
    console.log('posts end point');
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
    } else {

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

  // res.write("posts");
  // res.write("posts");
  // console.log("posts");
  // res.write(posts);

}

// var getToken = function(code, callback){
//   console.log('getToken called');
//   console.log('code', code, '*******');
//   console.log('p env', process.env);
//   var postData = JSON.stringify({
//     client_id: process.env.clientId,
//     client_secret: process.env.clientSecret,
//     code: code
//   });
//     var options = {
//     hostname: 'github.com',
//     port: 80,
//     path: '/login/oauth/access_token' ,
//     method: 'POST'
//   };
//   var req = http.request(options, function(res){
//     console.log('We have a reponse from github!');
//     var body = '';
//     res.on('data', function(chunk){
//       body += chunk;
//     });
//     res.on('end', function(){
//       console.log('github response body: ', body);
//       callback(body);
//     });
//   });
//
//   req.headers['Content-Type'] = 'application/json';
//   req.headers['Accept'] = 'application/json';
//   req.on('error', function(e){
//     console.log('problem with request: ' + e.message);
//   });
//   req.write(postData);
//   console.log('_____about to call req.end______');
//   req.end();
// };

module.exports = handler;
