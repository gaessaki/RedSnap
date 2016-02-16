var redis = require('redis');

var config = require('../config.js');

module.exports = redis.createClient({
    url: config.redisURL
});