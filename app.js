var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var common = require('./config/common');

var db = require('./db.js');
var passport = require("passport");
// var passportJs = require("./passport/passport.js")(passport); 

var index = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var product = require('./routes/product');
var order = require('./routes/order');
var user = require('./routes/customer');
var cms = require('./routes/cms');
var marketing = require('./routes/marketing');


var app = express();
process.env.NODE_ENV = process.env.NODE_ENV || 'local';
console.log('process.env.NODE_ENV' , process.env.NODE_ENV);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.use(passport.initialize());
require('./passport/passport')(passport);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use('/admin', passport.authenticate('authentication', {
    session: false
}))
app.use('/product', passport.authenticate('authentication', {
    session: false
}))

app.use('/order', passport.authenticate('authenticationOptional', {
    session: false
}))

app.use('/user', passport.authenticate('authentication', {
    session: false
}))


app.use('/', index);
app.use('/users', users);
app.use('/api', auth);
app.use('/admin', admin);
app.use('/product', product);
app.use('/order', order);
app.use('/user', user);
app.use('/cms', cms);
app.use('/admin/marketing', marketing);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app; 
