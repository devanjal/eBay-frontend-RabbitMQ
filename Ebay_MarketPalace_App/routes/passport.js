

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var mongo = require('./mongo');
var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');

module.exports = function(passport) {
    passport.use('signin', new localStrategy(
        {
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            console.log("inside passport")
            mongo.connect(mongoURL, function () {
                var loginCollection = mongo.collection('user');

                process.nextTick(function () {

                    var msg_payload = {"type": "login", "username": username,"password":password};


                    mq_client.make_request('login_queue', msg_payload, function (err, results) {
                        console.log(results);
                        if (err) {
                            throw err;
                        } else {
                            if (results==false) {
                                console.log("User account created." + results);

                                return done(null, false);}
                                else{
                                return done(null, results)
                            }

                        }
                    });
                });
            })
        }));
    passport.use('signup', new localStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            var data =
            {
                first_name: req.param("first_name"),
                last_name: req.param("last_name")
            };

            var msg_payload = {"type": "signup", "email": email, "password": password, "data": data};


            mq_client.make_request('login_queue', msg_payload, function (err, results) {
               // console.log(results);
                if (err) {
                    return done(null, err);
                } else {
                    if (results==false) {
                        console.log("User account created." + results);
                        //var json_response={results:results, code:results.code}
                        return done(null, false);}
                        else {

                        return done(null, results);
                        }
                    }


            })
        }))
}
            // mongo.connect(mongoURL, function () {
            //     var loginCollection = mongo.collection('user');
            //     console.log("inside 1");
            //     loginCollection.findOne({email: email}, function (err, rows) {
            //         if (err) return done(err);
            //         if (rows){
            //             console.log("user Exist")
            //             return done(null, false);}
            //         else {
            //
            //             var pass = bcrypt.hashSync(req.param("password"), bcrypt.genSaltSync(8), null)
            //             console.log(pass);
            //             var data =
            //             {
            //                 first_name: req.param("first_name"),
            //                 last_name: req.param("last_name"),
            //             };
            //
            //             loginCollection.insertOne(data, function (err, rows) {
            //                 if (err) console.error("Error in inserting new user" + err);
            //               //  mongo.close();
            //                 return done(null, results);
//                         });
//                     }
//                 });
//             });
//         }
//     ));
// }