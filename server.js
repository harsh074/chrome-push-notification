// server.js

// modules =================================================
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	request = require('request'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	favicon = require('serve-favicon'),
	mongo = require('mongodb'),
	monk = require('monk'),
	path = require ('path');

var config = require('./config/config');
var db = monk(config.dbUrl);
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.set('superSecret', config.secretKey);
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser());
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/'));

require('./routes/index')(app);

// app.use('/users', users);


// catch 404 and forwarding to error handler
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
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
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


var port = process.env.PORT || 8101;
app.listen(port, function () {
	console.log('%s: Node server started on %s:%d ...  ', Date(Date.now() ), port);
});
exports = module.exports = app;   