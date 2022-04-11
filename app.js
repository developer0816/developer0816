var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require("cors");




var app = express();
var config =  require("./routes");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Corse setup
app.use(cors());
app.options("*",cors());

config(app);
module.exports = app;
