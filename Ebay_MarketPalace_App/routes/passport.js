

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";

module.exports = function(passport) {
    passport.use('signin', new localStrategy(
        {
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            console.log("inside passport")
            mongo.connect(mongoURL, function() {
                var loginCollection = mongo.collection('user');

                process.nextTick(function(){

                    loginCollection.findOne({email : username}, function(err, rows) {

                        if(err){ console.log("error in login"); return done(err);}
                        else if(rows.length == 0) {console.log("rows = 0"); return done(null, false);}
                        else if(!bcrypt.compareSync(password, rows.password)) {
                            console.log("pass didn't mTCH");
                            return done(null, false);
                        }
                        //mongo.close();
                        console.log(rows.email);
                        return done(null, rows);
                    });
                });
            });
        }));

    passport.use('signup', new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            mongo.connect(mongoURL, function () {
                var loginCollection = mongo.collection('user');
                console.log("inside 1");
                loginCollection.findOne({email: email}, function (err, rows) {
                    if (err) return done(err);
                    if (rows){
                        console.log("user Exist")
                        return done(null, false);}
                    else {

                        var pass = bcrypt.hashSync(req.param("password"), bcrypt.genSaltSync(8), null)
                        console.log(pass);
                        var data =
                        {
                            first_name: req.param("first_name"),
                            last_name: req.param("last_name"),
                            email: req.param("email"),
                            password: pass
                        };

                        loginCollection.insertOne(data, function (err, rows) {
                            if (err) console.error("Error in inserting new user" + err);
                          //  mongo.close();
                            return done(null, data);
                        });
                    }
                });
            });
        }
    ));
}