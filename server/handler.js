var fs = require('fs');

var handler = function(req, res){
  var url = req.url;
  console.log(url);
  if(url === '/'){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end('woah!');
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end();
  }
};



module.exports = handler;
