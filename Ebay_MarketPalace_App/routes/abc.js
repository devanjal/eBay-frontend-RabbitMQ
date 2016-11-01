var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/try";

mongo.connect(mongoURL, function(){
    console.log('Connected to mongo at: ' + mongoURL);
    var coll = mongo.collection('xyz');
    coll.findOne(_id)

    coll.update({

    }, function(err, user){
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