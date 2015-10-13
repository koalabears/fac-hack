var shot = require('shot');
var fs = require('fs');
var test = require('tape');
var handler = require('./../../server/handler.js')

console.log(typeof handler);

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

serveTest('/', function(res, t) {
  // var index = fs.readFileSync('index.html');
  t.equal(res.payload, 'woah!', 'msg');
});

function statusTest(code) {
  return function(res, t) {
    t.equal(res.statusCode, code, "str");
  }
}

serveTest('/', statusTest(200));
// serveTest('/main.js', statusTest(200));
// serveTest('/style.css', statusTest(200));
serveTest('/woah!', statusTest(404));
