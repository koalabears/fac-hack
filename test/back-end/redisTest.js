var test = require('tape');
var db = require('../../server/redis.js');

// TODO: user proper test messages

db.startDB();

test('woah', function(t){
  db.postQuestion({test: 'woah!'}, function(data) {
    db.getQuestion(1, function(data) {
      t.equal(data.test, 'woah!')
      db.deleteLastQuestion(function() {
        t.end()
        db.stopDB();
      });
    });
  });
});
