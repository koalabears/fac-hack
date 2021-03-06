var redis = require('redis');
var client;
var qKey = 'questionId';
var aKey = 'answerId';

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
  var j = 1;
  client.GET(qKey, function(err, count) {
    var out = [];
    if (count === 0){
      callback('undefined');
    }
    while(j <= count) {
      getQuestion(j, function(qData) { //j is the id!
        out.push(qData);
        if (out.length.toString() === count) {
          callback(out);
        }
      });
      j += 1;
    }
  });
}

function getAllAnswers(callback) {
  var j = 1;
  client.GET(aKey, function(err, count) {
    var out = [];
    if (count === 0){
      callback('undefined');
    }
    while(j <= count) {
      getAnswer(j, function(aData) { //j is the id!
        out.push(aData);
        if (out.length.toString() === count) {
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
    postDataAsHash(qKey, questionId, qData, function(value) {
      client.SADD('questionIds', questionId, function(err, reply) {
        callback(value);
      });
    });
  });
}

function postAnswer(aData, callback) {
  // TODO: check qData for incorrect format
  client.INCR(aKey, function(err, answersId) {
    postDataAsHash(aKey, answersId, aData, function(value) {
      client.SADD('answerIds', answersId, function(err, reply) {
        callback(value);
      });
    });
  });
}

function getQuestion(id, callback) {
  client.HGETALL(qKey + id, function(err, value) {
    value.id = id;
    callback(value);
  });
}

function getAnswer(id, callback) {
  client.HGETALL(aKey + id, function(err, value) {
    value.id = id;
    callback(value);
  });
}


function postDataAsHash(dbKeyName, id, data, callback) {
  dbKey = dbKeyName + id;
  var objKeys = Object.keys(data),
      i = 0;
  objKeys.forEach(function(objKey) {
    client.HMSET(dbKey, objKey, data[objKey], function() {
      i += 1;
      if (i === objKeys.length) {
        client.HGETALL(dbKey, function(err, value) {
          value.id = id;
            callback(value);
        });
      }
    });
  });
}

function deleteQuestion(id, callback) {
  client.SISMEMBER('questionIds', id, function(err, reply) {
    client.del(qKey, id, function(err, rep) {
      client.SREM('questionIds', id, callback);
    });
  });
}
function fuckEverything(){
  client.FLUSHALL();
}

function deleteLastQuestion(callback) {
  client.GET(qKey, function(err, count) {
    deleteQuestion(count, callback);
  });
}

function userId(token, userName, callback) {
  client.set('user'+token, userName, function(err, reply) {
    callback();
  });
}

module.exports = {
  deleteLastQuestion: deleteLastQuestion,
  getQuestion: getQuestion,
  postQuestion: postQuestion,
  postAnswer: postAnswer,
  startDB: startDB,
  stopDB: stopDB,
  getAllQuestions: getAllQuestions,
  getAllAnswers: getAllAnswers,
  getMulti: getMulti,
  createCaller: createMiddlewareCaller,
  questionCount: questionCount,
  userId: userId,
  deleteQuestion: deleteQuestion,
  formatting: fuckEverything
};
