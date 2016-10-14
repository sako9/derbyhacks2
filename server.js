var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var jwt = require('express-jwt');
var config = require('./config/config');
var auth = jwt({
    secret: 'MY_SECRECT',
    userProperty: 'payload'
});

var port = process.env.PORT || 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var routes = require('./app/routes');
require('./app/config/passport');


var app = express();
var router = express.Router();


// Just some options for the db connection
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }};

mongoose.connect('mongodb://localhost:27017/', options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Log with Morgan 
app.use(morgan('dev'));

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));


//Static files 
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());



routes(router);
app.use('/v1.0/api',router);

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

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

app.get('/handle_mlh_callback', function (req, res) {
   console.log(req.query)
   console.log(req.params)
   console.log(req)
   
  res.end(JSON.stringify(req.query, null, 2))
})

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}); 

app.listen(port);
console.log('listening on port ' + port);
               
               