var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
var object_id="vp_id";
var mq_client = require('../rpc/client');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var ObjectID = require('mongodb').ObjectID;

exports.post_order_history=function(req,res){

    var msg_payload = {"type":"sell","user_id":req.session.user_id};
    mq_client.make_request('profile_queue',msg_payload,function(err,results){
        console.log(results);

        if(err){
            throw err;
        }else{
            if(results.code == 200){
                console.log("User account created."+results);

                res.send(results.user);
            }
            else{
                console.log("User account not created");
                res.send({"status":"Fail"});
            }
        }
    });
    // mysql.fetchData(insert_items,function(err,result){
    //     if(err){
    //         console.log(err);
    //
    //     }
    //     else{
    //
    //         res.send(result);
    //         console.log(result);
    //
    //
    //     }});
}
exports.buy_history=function(req,res) {

    var msg_payload = {"type":"buy","userid":req.session.user_id};
    mq_client.make_request('login_queue',msg_payload,function(err,results){
        console.log(results);

        if(err){
            throw err;
        }else{
            if(results.code == 200){
                console.log("User account created."+results);

                res.send(results.user);
            }
            else{
                console.log("User account not created");
                res.send({"status":"Fail"});
            }
        }
    });

    // mongo.connect(mongoURL, function () {
    //     console.log('Connected to mongo at: ' + req.session.user_id);
    //     var coll = mongo.collection('userhistory');
    //     coll.find({userid:new ObjectID(req.session.user_id)}).toArray(function (err, item) {
    //         if(!err){
    //         console.log(item)
    //         }
    //     })
    // });

    // mysql.fetchData(insert_items,function(err,result){
    //     if(err){
    //         console.log(err);
    //
    //     }
    //     else{
    //
    //         res.send(result);
    //         console.log(result);
    //
    //
    //     }});
}