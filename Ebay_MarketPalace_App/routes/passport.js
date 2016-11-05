/**
 * Created by Nikhil-PC on 10/26/2016.
 */

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";

module.exports = function(passport) {
    passport.use('signin', new localStrategy(
        {
            usernameField : 'userEmail',
            passwordField : 'userPassword',
            passReqToCallback : true
        },
        function(req, username, password, done) {

            mongo.connect(mongoURL, function() {
                var loginCollection = mongo.collection('ebaysignup');

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
            usernameField : 'registeremail',
            passwordField : 'pass',
            passReqToCallback : true
        },
        function (req, username, password, done) {
            mongo.connect(mongoURL, function () {
                var loginCollection = mongo.collection('ebaysignup');
                console.log("inside 1");
                loginCollection.findOne({email:username}, function (err, rows) {
                    if(err) return done(err);
                    if(rows) return done(null, false);
                    else {

                        var pass = bcrypt.hashSync(req.param("pass"), bcrypt.genSaltSync(8), null)
                        console.log(pass);
                        var data =
                        {
                            firstname: req.param("fname"),
                            lastname: req.param("lname"),
                            email: req.param("registeremail"),
                            password: pass
                        };

                        loginCollection.insertOne(data, function (err, rows) {
                            if(err) console.error("Error in inserting new user" + err);
                            mongo.close();
                            return done(null, data);
                        });
                    }
                });
            });
        }
    ));


};