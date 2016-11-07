var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
var object_id="vp_id";
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('../rpc/client');
var log = require('simple-node-logger').createSimpleLogger('user.log');

exports.getUser = function(req,res){
    // These two variables come from the form on
    log.info('User ID : ', req.session.user_id, '   purpose : Viewing Products  ', '  Date & Time:  ',new Date().toLocaleString());

    var json_responses;
    var collection='advertisement'
    var msg_payload = { "type":"Profile","userid":collection};

    console.log("GET profile Request" + collection);

    //mq_client.make_request('profile_queue',msg_payload, function(err,results){
    //
    //   //  console.log(results);
    //     if(err){
    //         throw err;
    //     }
    //     else
    //     {
    //         if(results.code == 200) {
    //             console.log("Profile fetched   " + results.items);
    //
    //             res.send(results.items);
    //         }
    //         else {
    //
    //             console.log("Profile has some issue");
    //             res.send({"status":"Fail"});
    //         }
    //     }
    // });
    mongo.connect(mongoURL, function() {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('advertisement');
        var des = coll.find().toArray(function(err, items) {
            console.log(items);
            res.send(items);
        })
    })
};

exports.getUser1=function(req,res){
    var insert_items='SELECT * FROM advertisement'
    //console.log(req.session.user);

    mysql.fetchData(insert_items,function(err,result){
        if(err){
            console.log(err);

        }
        else{
            console.log(result);
            var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","Checkout")';

            mysql.fetchData(log_sql,function(err,result){
                if(err){
                    console.log("Log Error"+err);
                }else{

                }
            });
            var test=JSON.stringify(result);
            json_response={"result":result, "user_id":req.session.user_id}
            res.send(result);
            console.log(result);


        }});
//}
//else{
    console.log("Error Devanjal")
    //  }
}
exports.display=function(req,res){
    //if(req.session) {
    res.render('product', {title: 'product'});
    //  }
    //else{
    //    console.log("Error Kotia")
    //}
};
