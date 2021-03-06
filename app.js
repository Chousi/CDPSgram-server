var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');
var flash = require('express-flash');
var methodOverride = require('method-override');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'CDPSgram', resave:false, saveUninitialized:true}))
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// Para cada petición HTTP comprueba si el usuario está logueado, y si lo 
// está comprueba si su sesión caducó por inactividad. Si es así, se destruye la sesión, y 
// y el usuario tendrá que volver a autenticarse. Se ha establecido un período de
// 2 minutos.

if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    if (req.session.user){
      var currentTime = new Date();
      var userTime = new Date(req.session.user.lastPetition);
      var difference = (currentTime.getTime() - userTime.getTime());
      var timeout = 120000;
      if(difference > timeout){
        delete req.session.user;
        res.redirect('/session');
        next();
      } else {
        req.redirect.user.lastPetition = new Date();
        next();
      }
    } else {
      next();
    }
  });
}


app.use(function(req, res, next) {
  // Hacer visible req.session en las vistas
    res.locals.session = req.session;

    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
