var redis = require('redis');
var client;
var qKey = 'questionId';

var createMiddlewareCaller = function () {
  var middlewareStore = [];

  function caller () {
    (function next(){
      middlewareStore.shift()(next);
    }());
  }

  caller.add = function (fn) {
    middlewareStore.push(fn);
    return this;
  };

  return caller;
};

function questionCount(callback) {
  client.GET(qKey, function(err, count) {
    callback(count);
  });
}

function startDB() {
  client = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});
}

function stopDB() {
  client.quit();
}

function getMulti() {
  return client.multi();
}

function getAllQuestions(callback) {
  var i = 0, j = 1;
  client.GET(qKey, function(err, count) {
    var out = [];
    if (count === 0){
      callback('undefined');
    }
    while(j <= count) {
      getQuestion(j, function(qData) {
        i += 1;
        out.push(qData);
        if (i.toString() === count) {
          callback(out);
        }
      });
      j += 1;
    }
  });
}

function postQuestion(qData, callback) {
  // TODO: check qData for incorrect format
  client.INCR(qKey, function(err, questionId) {
    postDataAsHash(qKey +  questionId, qData, callback);
  });
}

function getQuestion(id, callback) {
  client.HGETALL(qKey + id, function(err, value) {
      callback(value);
  });
}

function postDataAsHash(dbKey, data, callback) {
  var objKeys = Object.keys(data),
      i = 0;
  objKeys.forEach(function(objKey) {
    client.HMSET(dbKey, objKey, data[objKey], function() {
      i += 1;
      if (i === objKeys.length) {
        client.HGETALL(dbKey, function(err, value) {
          // return value;
            callback(value);
        });
      }
    });
  });
}

function deleteLastQuestion(callback) {
  client.DECR('questionId', function(err, id) {
    client.del('questionId' + (id+1), function(err, num) {
      callback();
    });
  });
}

module.exports = {
  deleteLastQuestion: deleteLastQuestion,
  getQuestion: getQuestion,
  postQuestion: postQuestion,
  startDB: startDB,
  stopDB: stopDB,
  getAllQuestions: getAllQuestions,
  getMulti: getMulti,
  createCaller: createMiddlewareCaller,
  questionCount: questionCount
};
