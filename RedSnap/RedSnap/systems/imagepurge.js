//cron job that deletes photos that have all been played
var CronJob = require('cron').CronJob;
var redis = require('redis');
var client = require('../systems/rediscon.js');
var async = require('async')

module.exports = new CronJob('00 00 4 * * 0-6', function () {

    client.lrange('deletion', 0, -1, function (err, reply) {

        async.each(reply, function (snap_id, cb) { 
            
            //delete from filesystem
            //delete snap data from redis
            //call cronjob from app.js
        
        }, function (err) { 
        
        })

    })
});