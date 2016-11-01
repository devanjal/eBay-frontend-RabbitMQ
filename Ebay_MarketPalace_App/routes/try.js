var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
var object_id="vp_id";
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/hello";

exports.gettry = function(req,res){

    var json_responses;

    mongo.connect(mongoURL, function() {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('try');
        var des = coll.find().toArray(function(err, items) {
            console.log(items);
            res.send(items);
        });
    })
};
