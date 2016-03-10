var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.render('index'); // load the single view file (angular will handle the page changes on the front-end)
});

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


app.get('/get-push-data', function(req,res){
	var notification = {
		"title":"Push message",
		"message":"The Message",
		"icon":"https://c1.staticflickr.com/3/2723/4482561996_dce49b1016_z.jpg",
		"tag":"Chrome Push Notifications"
	}
	res.send(notification);
	res.status(200).end();
});

var port = process.env.PORT || 8000;
app.listen(port, function () {
	console.log('%s: Node server started on %s:%d ...  ', Date(Date.now() ), port);
});
