var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var homeRouter = require('./routes/home');
var photoRouter = require('./routes/photo');
var favoritesRouter = require('./routes/favorites');
var usersRouter = require('./routes/users');
var likesRouter = require('./routes/likes');

var cors = require('cors');
var app = express();
app.use(cors());

//Set up mongoose connection
var mongoose = require('mongoose');

var mongoDB = 'mongodb+srv://proenza:mongo4ever@cluster0.epxkx.mongodb.net/photoHub?retryWrites=true&w=majority'

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', parameterLimit: 100000, extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/home', homeRouter);
app.use('/photo', photoRouter);
app.use('/favorites', favoritesRouter);
app.use('/user', usersRouter);
app.use('/like', likesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
