var test = require('tape');
var db = require('../../server/redis.js');

// TODO: user proper test messages

db.startDB();

var caller = db.createCaller();


test('basic server test', function(t) {
  caller.add(function(next) {
    db.postQuestion({test: 'woah!'}, function(data) {
      t.deepEqual(data, {test: 'woah!'}, 'post question returns what was posted');
      next();
    });
  }).add(function(next) {
    db.postQuestion({
        id: '12',
        someText: 'ipso bla bla'
    }, function(data) {
      next();
    });
  }).add(function(next) {
    db.postQuestion({test: 'woah!'}, function(data) {
      console.log('call one: ', data);
      next();
    });
  }).add(function(next) {
     db.getQuestion(2, function(data) {
       t.deepEqual(data, {
           id: '12',
           someText: 'ipso bla bla'
       }, 'getQuestion gets what was posted');
       next();
    });
  }).add(function(next) {
    db.deleteLastQuestion(function() {
      db.deleteLastQuestion(function() {
        db.deleteLastQuestion(function() {
          next();
        });
      });
    });
  }).add(function(next) {
    db.questionCount(function(count) {
      t.equal(count, '0', 'no questions in db after tests');
      db.stopDB();
      t.end();
    });
  });
  caller();
});
