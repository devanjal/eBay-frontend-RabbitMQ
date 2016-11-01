/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.checkSignup = function(req,res){
	// These two variables come from the form on
	// the views/login.hbs page
	var first_name = req.param("first_name");
	var last_name = req.param("last_name");
	var email = req.param("email");
	var password = req.param("password");
	console.log(password +" is the object");
	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user');

		coll.insert({first_name: first_name, last_name:last_name,email: email, password:password}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				// req.session.username = user.username;
				//console.log(req.session.username +" is the session");
				json_responses = {"statusCode" : 200};
				res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
};



//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

