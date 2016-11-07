/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');

exports.checkSignup = function(req,res){
	// These two variables come from the form on
	// the views/login.hbs page
	var first_name = req.param("first_name");
	var last_name = req.param("last_name");
	var email = req.param("email");
	var password = req.param("panssword");
	console.log(password +" is the object");
	var json_responses;

	//console.log("GET profile Request" + collection);

	var msg_payload = {"type":"signup","first_name":first_name ,"last_name":last_name , "email":email,"password":password};

	//console.log("POST Request for signup :"+name +" "+newUserEmail+" "+newUserPassword);

	mq_client.make_request('login_queue',msg_payload,function(err,results){
		console.log(results);

		if(err){
			throw err;
		}else{
			if(results.code == 200){
				console.log("User account created.");
				res.send({"status":"Success"});
			}
			if(results.code == 402){
				console.log("User account created.");
				res.send({"status":"Fail2"});
			}
			else{
				console.log("User account not created");
				res.send({"status":"Fail"});
			}
		}
	});
	// mongo.connect(mongoURL, function(){
	// 	console.log('Connected to mongo at: ' + mongoURL);
	// 	var coll = mongo.collection('user');

		// coll.insert({first_name: first_name, last_name:last_name,email: email, password:password}, function(err, user){
		// 	if (user) {
		// 		// This way subsequent requests will know the user is logged in.
		// 		// req.session.username = user.username;
		// 		//console.log(req.session.username +" is the session");
		// 		json_responses = {"statusCode" : 200};
		// 		res.send(json_responses);
        //
		// 	} else {
		// 		console.log("returned false");
		// 		json_responses = {"statusCode" : 401};
		// 		res.send(json_responses);
		// 	}
	// 	// });
	// });
};



//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};

