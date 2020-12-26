var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(__dirname + "/public"));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'routes')));
app.use("/routes", express.static(__dirname + "/routes"));
app.use(express.static('routes'));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(express.static('node_modules'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
