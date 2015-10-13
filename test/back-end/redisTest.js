var test = require('tape');
var db = require('../../server/redis.js');

db.startDB();

test('woah', function(t){
  db.postQuestion({test: 'woah!'}, function(data) {
    db.getQuestion(1, function(data) {
      t.equal(data.test, 'woah!')
      db.deleteLastQuestion(function() {
        console.log('---------')
        t.end()
        db.stopDB();
      });
    });
  });
});
