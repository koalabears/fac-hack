var fs = require('fs');
var index = fs.readFileSync(__dirname + '/../public/html/index.html');
var indexJS = fs.readFileSync(__dirname + '/../public/js/main.js');

var handler = function(req, res) {
  var url = req.url;
  console.log(url);
  if (url === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(index);
  } else if (url === '/main.js') {
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

module.exports = handler;
