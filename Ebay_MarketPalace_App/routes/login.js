var ejs=require('ejs');
var mysql= require('./mysql');
var passwordHash = require("password-hash");
var session = require('express-session');
var object_id="lo_id";
var description="Logged on";
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

exports.checkLogin = function(req,res){
	// These two variables come from the form on
	// the views/login.hbs page
	var email = req.param("email");
	var password = req.param("password");
	console.log(password +" is the object");
	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user');

		coll.findOne({email: email, password:password}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.

				req.session.email = user.last_name;
				req.session.first_name = user.first_name;
				req.session.last_name = user.last_name;
				req.session.user_id = user._id;
				req.session.devanjal = user.last_login;
				console.log(req.session.username + " is the session");
				coll.update({_id:mongo.ObjectId(user._id)},
					{
						$set:{last_login: new Date().toLocaleString()}
					}

				);
				json_responses = {"statusCode": 200};
				res.send(json_responses);
			}
			 else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
};

exports.logout=function (req, res) {
	req.session.destroy();
	res.send("logout success!");
};