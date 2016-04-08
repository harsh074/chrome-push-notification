
var express 		= require('express'),
		apiRoutes 	= express.Router(),
		bcrypt 			= require('bcrypt-nodejs'),
		passport 		= require('passport'),
		jwt 				= require('jsonwebtoken'),
		fs 					= require('fs'),
		multipart 	= require('connect-multiparty'),
		MPMiddleware = multipart();

// var blogRouter = express.Router({mergeParams: true});
/* GET home page. */


// apiRoutes.use('/blog', blogRouter);
module.exports = function(app) {
	app.use('/api', apiRoutes);
	

	function hashPassword(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	}

	function comparePassword(password, salts) {
		return bcrypt.compareSync(password, salts);	
	}

	function randomString(length) {
		return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
	}

	function authenticate(req, res, next) {
		// check header or url parameters or post parameters or cookies for token
		var token = req.body.token || req.query.token || req.headers['token'] || req.cookies['token'];
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
				if (err) {
					return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });    
				} else {
					// if everything is good, save to request for use in other routes
					// console.log("decoded",decoded)
					req.decoded = decoded;    
					next();
				}
			});
		} else {
			// if there is no token
			// return an error
			return res.status(403).send({ 
					success: false, 
					message: 'No token provided.' 
			});
			
		}
	};

	// route to register a user (POST http://localhost:5000/api/register)
	apiRoutes.post('/register',function(req,res){
		var db = req.db;
		var collection = db.get('auth_users');

		var newUser = {
			first_name: 	req.body.first_name,
			last_name: 		req.body.last_name,
			email: 				req.body.email,
			// password: 		req.body.password,
			salts: 				hashPassword(req.body.password),
			date_joined : new Date()
		};
		collection.insert(newUser, function(err, result){
			if (err) throw err;
			
			var token = jwt.sign(newUser, app.get('superSecret'), {
				expiresIn: 86400 // expires in 24 hours
			});
			// res.cookie('token', token, { path: '/', httpOnly: true });
			res.json({
				token: token
			});
		});
	});

	// route to authenticate a user (POST http://localhost:5000/api/login)
	apiRoutes.post('/login', function(req, res) {
		var db = req.db;
		var collection = db.get('auth_users');
		// find the user
		collection.findOne({email: req.body.email}, function(err, user) {
			if (err) throw err;

			if (!user) {
				res.status(400).json({ success: false, message: 'Authentication failed. User not found.' });
			} else if (user) {

				// check if password matches
				// console.log(user)
				// console.log(comparePassword(req.body.password,user.salts));
				if (!comparePassword(req.body.password,user.salts)) {
					res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresInSeconds: 3600 // expires in 24 hours
					});

					// return the information including token as JSON
					// res.cookie('token', token, { path: '/', httpOnly: true });
					res.status(200).json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}   
			}
		});
	});

	// route to return all users (GET http://localhost:5000/api/users)
	apiRoutes.get('/profile',authenticate, function(req, res) {
		var db = req.db;
		var userCollection = db.get('auth_users');
		userCollection.find({ownerid:req.decoded.ownerid},function(err, result){
			res.json({
				first_name:req.decoded.first_name,
				last_name:req.decoded.last_name,
				email:req.decoded.email
			});
		})
	});

	app.get('/', function(req, res) {
		res.render('./public/index'); // load our public/index.html file
	});
}
