var http = require('http');
var handler = require('./handler.js');
var port = process.env.PORT || 5000;
var socket = require('./socket.js');

var server = http.createServer(handler);
server.listen(port, function(){
  console.log('node http server listening on http://localhost:' + port);
});
socket(server);
