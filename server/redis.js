var redis = require('redis');
var client;
var qKey = 'questionId';

function startDB() {
  client = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});
}

function stopDB() {
  client.quit();
}

function postQuestion(qData, callback) {
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
        callback();
      }
    });
  });
}

function deleteLastQuestion(callback) {
  console.log('deleteLastQuestion called');
  client.DECR('questionId', function(err, id) {
    console.log('dec callback');
    client.del('questionId' + (id+1), function(err, num) {
      console.log('number deleted: ',num);
      callback()
    });
  })
}

module.exports = {
  deleteLastQuestion: deleteLastQuestion,
  getQuestion: getQuestion,
  postQuestion: postQuestion,
  startDB: startDB,
  stopDB: stopDB
};
