var fs = require('fs');

var handler = function(req, res){
  var url = req.url;

  if(url === '/'){
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
  }
};



module.exports = handler;
