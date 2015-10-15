var shot = require('shot');
var fs = require('fs');
var test = require('tape');
var handler = require('./../../server/handler.js');
var fs = require('fs');
var index = fs.readFileSync(__dirname + '/../../public/html/index.html');
var db = require('./../../server/redis.js');
// TODO: user proper test messages

db.startDB();

function serveTest(url, func) {
  test("msg", function(t) {
    var req = {
        method: 'GET',
        url: url
      };
    shot.inject(handler, req, function(res) {
      func(res, t);
      t.end();
    });
  });
}

// serveTest('/', function(res, t) {
//   // var index = fs.readFileSync('index.html');
//   t.equal(res.payload, index, 'msg');
// });

function statusTest(code) {
  return function(res, t) {
    t.equal(res.statusCode, code, "str");
  };
}

serveTest('/', statusTest(302));
// serveTest('/main.js', statusTest(200));
// serveTest('/style.css', statusTest(200));
serveTest('/woah!', statusTest(404));

// serveTest('/posts', statusTest(200));

db.stopDB();
