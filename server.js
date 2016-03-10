var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index'); // load the single view file (angular will handle the page changes on the front-end)
});

app.post('/v1/log', function (req, res) {
		// Do Logging Stuff
		console.log(req.body.logs);
		res.status(200).end();
});


var port = process.env.PORT || 8000;
app.listen(port, function () {
		console.log('%s: Node server started on %s:%d ...  ', Date(Date.now() ), port);
});
