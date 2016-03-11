var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

var mongo = require('mongodb');
var monk = require('monk');
// var db = monk('localhost:27017/chrome-notification');
var db = monk('harsh074:password@ds011389.mlab.com:11389/chrome-notification');

var routes = require('./routes/index');
var users = require('./routes/users');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){         // Make our db accessible to our router
  req.db = db;
  next();
});

app.use('/', routes);
// app.use('/users', users);



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

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



/*
app.post('/send-push', function (req, res) {
	var options = {
		method: "POST",
		url: req.body.endpoint,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'key=AIzaSyDl3hQEx38FRjDvWh3ZgGaIeJXxd-EeeR8'
		},
		json:{'registration_ids':[req.body.registrationId]}
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send(body);
			res.status(200).end();
		}
	}
	request(options, callback);
});

app.post('/register-push', function (req, res){

	res.status(200).end();
});


app.get('/get-push-data', function(req,res){
	var notification = {
		"title":"Push message",
		"message":"The Message",
		"icon":"http://www.io-media.com/sites/all/themes/iomedia/images/fbshareicon.png",
		"tag":"Chrome Push Notifications"
	}
	res.send(notification);
	res.status(200).end();
});*/



var port = process.env.PORT || 8000;
app.listen(port, function () {
	console.log('%s: Node server started on %s:%d ...  ', Date(Date.now() ), port);
});
module.exports = app;