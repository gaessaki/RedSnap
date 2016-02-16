'use strict';

var passport = require('passport');

exports.session = function (req, res) {
    res.json(req.user.user_info);
};

exports.logout = function (req, res) {
    if (req.user) {
        req.logout();
        res.send(200);
    } else {
        res.send(400, "Not logged in");
    }
};

exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) {
            console.log(error)
            return res.status(404).send(error);
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(error)
                res.status(404).send(error);
            }
            else {
                console.log(req.user)
                res.send(req.user.user_info);
            }
        });
    })(req, res, next);
}
