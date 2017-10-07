var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var ehproperties = require('./routes/ehproperties');
var assocattractions = require('./routes/assocattractions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve built React app client-side files from their directory. This is for us
// to run the client and server apps on the same port in production.
// See https://www.ibm.com/blogs/bluemix/2017/06/react-web-express-api-development-production/
// In development it will still use the proxy in ../client/package.json
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.use('/', index);
app.use('/users', users);
app.use('/ehproperties', ehproperties);
app.use('/assocattractions', assocattractions);

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
