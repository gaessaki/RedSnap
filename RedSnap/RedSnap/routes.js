var passport = require('passport');
var auth = require('./systems/auth');
var nocache = require('./systems/nocache.js');

module.exports = function (app) {
    // User Routes
    var session = require('./controllers/session');
    var users = require('./controllers/user');
    var snap = require('./controllers/snap');
    
    app.get('/api/snaps', nocache, auth.ensureAuthenticated, snap.receivesnaps);
    app.post('/api/snaps', auth.ensureAuthenticated, snap.sendsnaps);
    
    app.post('/api/snaps/view', auth.ensureAuthenticated, snap.viewsnap);

    app.get('/api/friends', nocache, auth.ensureAuthenticated, users.friends);
    app.post('/api/friends', auth.ensureAuthenticated, users.friend);
    app.delete('/api/friends', auth.ensureAuthenticated, users.unfriend);
    
    app.post('/auth/users', users.register);
    
    app.get('/auth/session', auth.ensureAuthenticated, session.session);
    app.post('/auth/session', session.login);
    app.delete('/auth/session', session.logout);
    
    // Angular Routes
    //app.get('/views/main', auth.ensureAuthenticated, session.session, function (req, res) {
    //    res.send('views/main.html')
    //})
    //app.get('/views/*', function (req, res) {
    //    var requestedView = path.join('./', req.url);
    //    res.send(requestedView);
    //});
    
    app.get('/*', function (req, res) {
        if (req.user) {
            res.cookie('user', JSON.stringify(req.user));
        }
        
        res.send('index.html');
    });

}

//module.exports = function (app) {
    
//    app.get('api/account', auth.ensureAuthenticated, function (req, res) {
//        if (req.isAuthenticated()) {
//            res.json(req.user);
//        }
//        res.send(401);
//    });  
    
//    app.post('api/account/login',
//        passport.authenticate('local', function (req, res) {
//        User.find({username: req.body.username}, function (err, user) {
//            if (err) res.send(err);
//            var identity = {
//                id: user._id,
//                username: user.username,
//                email: user.email,
//                friends: user.friends,
//                snap_count: user.snap_count
//            }
//            res.send(identity);
//        })
//    }));


    
//    app.post('api/account/register', function (req, res) {
//        User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, function (err) {
//            if (err) console.log('error during registration')
//        });
//        User.find({ username: req.body.username }, function (err, user) {
//            var identity = {
//                id: user._id,
//                username: user.username,
//                email: user.email,
//                friends: user.friends,
//                snap_count: user.snap_count
//            }
//            res.send(identity);
//        })
//    });
//    app.get('api/account/logout', function (req, res) {
//        req.logout();
//        res.status(200);
//    })
//    //app.get('/views/*', function (req, res) {
//    //    var view = path.join('./', req.url);
//    //    console.log(view)
//    //    res.sendfile(view)
//    //})
//    //app.get('/', function (req, res) {
//    //    if (req.user) {
//    //        res.cookie('user', JSON.stringify(user));
//    //    }
//    //    res.sendfile(index.html)
//    //})
//}