var test = require('tape');
var db = require('../../server/redis.js');

// TODO: user proper test messages

db.startDB();

var caller = db.createCaller();


test('basic server test', function(t) {
  var initPosts;
  caller.add(function(next) {
    db.questionCount(function(count) {
      initPosts = parseInt(count);
      next();
    });
  }).add(function(next) {
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
      next();
    });
  }).add(function(next) {
     db.getQuestion(2+initPosts, function(data) {
       t.deepEqual(data, {
           id: '12',
           someText: 'ipso bla bla'
       }, 'getQuestion gets what was posted');
       next();
    });
  }).add(function(next) {
     db.getAllQuestions(function(data) {
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
      t.equal(parseInt(count), initPosts, 'same number of questions in db as before tests');
      db.stopDB();
      t.end();
    });
  });
  caller();
});
