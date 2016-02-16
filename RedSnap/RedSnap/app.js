var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis') (session);

var config = require('./config.js');
var mongoose = require('mongoose');

var client = require('./systems/rediscon.js')

client.on('connect', function () {
    console.log('Connection to Redis Server established');
});

global.appRoot = path.resolve(__dirname);

var app = express();

var passport = require('passport');
var User = require('./models/User');

//var io = require('socket.io').listen(app);
//var socket = require('./controllers/socket');

mongoose.connect(config.mongoURL, config.mongoOptions, function (err, res) {
    if (err) console.log("error connecting to db " + err)
    else console.log('Connection to MongoDB instance established')
});

var pass = require('./systems/pass')

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '2048kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'McGillCollegeAveXs',
    store: new RedisStore({ client: client, ttl: 260 }),
    saveUninitialized: false,
    resave: false
}))
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

require('./routes.js')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//io.sockets.on('connection', socket)

module.exports = app;
