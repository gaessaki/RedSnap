var redis = require('redis');
var async = require('async');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var uuid = require('node-uuid');
const fs = require('fs');

var conf = require('../config')

var mongoose = require('mongoose'),
    User = mongoose.model('User');
var client = require('../systems/rediscon.js');

exports.receivesnaps = function (req, res, next) {
    var snaps = []
    client.lrange(req.user.username, 0, -1, function (err, obj) {
        if (err) {
            console.log(err)
            return res.status(400).send().end();
        }
        else {
            console.log(obj)
            async.each(obj, function (item, cb) {
                client.hgetall(item, function (err, snapHash) {
                    if (err) {
                        console.log(err);
                    }
                    snaps.push(snap = {
                        id: item,
                        sender: snapHash.sender
                    });
                    console.log(item);
                    cb();
                })
            }, function () {
                if (snaps) {
                    console.log(200)
                    return res.status(200).send(snaps);
                }
            })
        }
    })
}

exports.viewsnap = function (req, res, next) {
    var snapResData = {}
    var dataURIIdentifier = "data:image/png;base64,";
    client.hgetall(req.body.snapInfo.id, function (err, snapHash) {
        if (err) {
            console.log(err);
            return res.status(400).end();
        }
        else {
            fs.readFile(snapHash.imgloc, 'base64', function (err, data) {
                if (err) console.log(err);
                else {
                    var imgdata = dataURIIdentifier.concat(data);
                    snapResData = {
                        id: req.body.snapInfo.id,
                        sender: snapHash.sender,
                        time: snapHash.time,
                        msg: snapHash.msg,
                        imgData: imgdata
                    }
                    
                    if (conf.deleteSnaps) {
                        var friendsArr = snapHash.friends.split(','); //regex may be better for this
                        var ind = friendsArr.indexOf(req.user.username);
                        var friendsStr = "";
                        console.log(friendsArr)
                        friendsArr.splice(ind, 1)
                        
                        //Check if there are more friends that need to see snap, if not, then queue snap for deletion
                        if (friendsArr != ['']) {
                            for (i = 0; i < friendsArr.length; i++) {
                                friendsStr = friendsStr.concat(req.user.username + ',');
                            }
                        }
                        else {
                            client.lpush('deletion', req.body.snapInfo.id)
                        }
                        
                        client.hset(req.body.snapInfo.id, 'friends', friendsStr);
                        client.lrem(req.user.username, 1, req.body.snapInfo.id);
                    }
                    return res.status(200).json(snapResData);
                }
            })
        }
    }) 
}

exports.sendsnaps = function (req, res, next) {    
    if (req.body.snap.friends.length < 1) {
        console.log("No friends selected!");
        return res.status(400).send("No friends were selected!");
    }
    
    var md5sum = crypto.createHash('md5').update(req.user.username + new Date().toString()).digest('hex');
    var dirPath = './snapStorage/' 
        + md5sum.substring(0, 2) + '/' 
        + md5sum.substring(2, 4) + '/' 
        + md5sum.substring(4, 7) + '/' 
        + md5sum.substring(7, 14) + '/';
    
    mkdirp(dirPath, function (err) {
        if (err) {
            console.log(err + 'ho')
            return res.status(400).send(err).end();
        }
        else {
            var b64imgData = req.body.snap.img.replace(/^data:image\/png;base64,/, "");
            fs.writeFile(dirPath + md5sum.substring(14, 32) + '.txt', b64imgData, 'base64', function (err) {
                if (err) {
                    console.log(err + 'eh')
                    return res.status(400).send(err).end();
                }
                else {
                    incrSnapSentCount(req.user.username, function (err) {
                        if (err) {
                            console.log(err + 'ah')
                            return res.status(400).send(err).end()
                        }
                        else {
                            var snap_id = uuid.v4();
                            var friendArrayString = ""; //I know this is bad... forgive me
                            async.each(req.body.snap.friends, function (friend, cb) {
                                console.log(friend)
                                incrSnapRecCount(friend, function (err) {
                                    if (err) {
                                        return cb(err)
                                    }
                                    else {
                                        client.lpush(friend, snap_id);
                                        friendArrayString = friendArrayString.concat(friend + ',')
                                        cb();
                                    }
                                })
                            }, function (err) {
                                if (err) {
                                    console.log(err)
                                    return res.status(400).send(err).end();
                                }
                                if (!req.body.snap.text) {
                                    req.body.snap.text = "";
                                }
                                client.hmset(snap_id, {
                                    "sender": req.user.username,
                                    "imgloc": dirPath + md5sum.substring(14, 32) + '.txt',
                                    "timestamp": new Date(),
                                    "time": req.body.snap.time,
                                    "msg": req.body.snap.text,
                                    "friends": friendArrayString
                                });
                                return res.status(200).send().end();
                            });
                            /*for (i = 0; i < req.body.snap.friends.length; i++) {
                                var friend = req.body.snap.friends[i];
                                
                                incrSnapRecCount(friend, function (err) {
                                    if (err) {
                                        console.log(err + 'eh ');
                                        return res.status(400).send(err).end();
                                    }
                                    else {
                                        client.lpush(friend, snap_id);
                                        friendArrayString += ',' + friend;
                                    }
                                })
                            }*/

                        }
                    })
                }
            })
        }
    })
}

var incrSnapSentCount = function (name, cb) {
    User.findOneAndUpdate({ username: name }, {
        $inc : {
            'snap_count.sent' : 1
        }
    }, function (err, re) {
        if (err) {
            return cb(err + 'wo');
        }
        else {
            return cb();
        }
    })
}
var incrSnapRecCount = function (name, cb) {
    User.findOneAndUpdate({ username: name }, {
        $inc : {
            'snap_count.received' : 1
        }
    }, function (err, re) {
        if (err) {
            return cb(err + 'wa');
        }
        else {
            return cb();
        }
    })
}

/* for (k = 0; k < obj.length; k++) {
        
        client.hgetall(obj[k], function (err, snapHash) {
            console.log(k)
            if (err) {
                console.log(err);
                return (err, null);
            }
            else {
                snaps.push(snap = {
                    id: obj[k],
                    sender: snapHash.sender
                });
            }
            console.log(obj[k]);
            //snaps[i].sender = snapHash.sender;
        })
    } */
