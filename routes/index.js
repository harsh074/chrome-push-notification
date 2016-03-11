var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index');
});


/* GET Userlist page. */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('listConnected');
	collection.find({},{},function(e,docs){
		console.log(docs);
		res.status(200).end();
	});
});



module.exports = router;