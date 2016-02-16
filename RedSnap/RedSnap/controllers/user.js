var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

exports.register = function (req, res, next) {
    console.log("registering user")
    var registrant = new User({
        username : req.body.username,
        password : req.body.password,
        email : req.body.email
    });
    
    registrant.save(function (err) {
        if (err) {
            console.log(err)
            return res.json(err)
        }
    })
    
    req.logIn(registrant, function (err) {
        if (err) return next(err);
        return res.json(registrant.user_info);
    })
}

exports.friends = function (req, res, next) {
    console.log('listing friends for ' + req.user.username)
    User.findOne({ 'username': req.user.username }, 'friends', function (err, user) {
        console.log(user.friends);
        return res.json(user.friends);
    })
}

exports.friend = function (req, res, next) {
    if (!req.body.friend) {
        console.log("No friend added");
        return res.send().status(400).end();
    }
    console.log(req.user.username + ' is attempting to friend ' + req.body.friend)
    if (req.user.username == req.body.friend) {
        console.log("Can't friend yourself!");
        return res.send().status(400).end();
    }
    else {
        User.findOne({ 'username' : req.body.friend }, function (err, user) {
            if (err || !user) {
                console.log(err)
                return res.send(err).status(400).end();//user presumably not found
            }
            var isCurrFriend = user.user_info.friends.current.map(function (e) { return e.username; }).indexOf(req.user.username);
            var isReqFriend = user.user_info.friends.requested.map(function (e) { return e.username; }).indexOf(req.user.username);
            if (isCurrFriend != -1) {
                console.log(req.user.username + ' is already friends with ' + req.body.friend)
                return res.send(req.user.username + ' is already friends with ' + req.body.friend).status(400).end()
                //return res.json(req.user.username + ' is already friends with ' + req.body.friend)
            }
            else {
                User.findOne({ 'username' : req.user.username }, function (err, currUser) {
                    if (err) {
                        console.log(err)
                        return res.send(err).status(400).end(); //user presumably not found, but how would that even be possible?
                    }
                    var isUserFriendIndex = currUser.user_info.friends.requested.map(function (e) { return e.username; }).indexOf(user.username); //currUser.user_info.friends.requested.indexOf(user.username);
                    console.log(isUserFriendIndex)
                    if (isUserFriendIndex != -1) { //is there an existing request from interested party? If so, both users should be friends now
                        
                        User.findOneAndUpdate({ 'username' : req.user.username }, {
                            $push: {
                                'friends.current' : {
                                    '_id': user._id, 
                                    'username': user.username
                                }
                            }, 
                            $pull: {
                                'friends.requested' : {
                                    'username': user.username
                                }
                            }
                            
                        }, function (err, us) {
                            if (err) console.log(err);
                        })
                        User.findOneAndUpdate({ 'username' : req.body.friend }, {
                            $push: {
                                'friends.current' : {
                                    '_id': currUser._id,
                                    'username': currUser.username
                                }
                            }
                        }, function (err, us) {
                            if (err) console.log(err);
                            return res.send().status(200).end();
                        })
                    }
                    else if (isReqFriend) { //Did the user send a request to the friend in the past? If not, then send it now
                        user.user_info.friends.requested.push({ _id: req.user._id, username: req.user.username });
                        User.findOneAndUpdate({ 'username' : req.body.friend }, user, function (err, us) {
                            if (err) console.log(err);
                        })
                        return res.send().status(200).end();
                    }
                    else {
                        return res.send().status(404).end();
                    }
                })
            }
        })
    }
    
}
//check if friend exists
//check if friend already
//check if user has already send request
//if so then confirm that both are now friends, remove requested friend for both users and add current for both
//if not then set user as requested friend for target

exports.unfriend = function (req, res, next) {
    console.log(req.user.username + " is trying to unfriend " + req.query.friend)
    User.findOneAndUpdate({ 'username' : req.query.friend }, {
        $pull : {
            'friends.current' : {
                'username': req.user.username
            }
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
    })
    User.findOneAndUpdate({ 'username' : req.user.username }, {
        $pull : {
            'friends.current' : {
                'username': req.query.friend
            }
        }
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        else {
        }
    })
    return res.send().status(200).end()
}
