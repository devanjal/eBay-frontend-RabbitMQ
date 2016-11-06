var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
var mq_client = require('../rpc/client');
var log = require('simple-node-logger').createSimpleLogger('user.log');
exports.viewProfile=function(req,res){
    log.info('User ID : ', req.session.user_id, '   purpose : Viewed Profile  ', '  Date & Time:  ',new Date().toLocaleString());
    var msg_payload = {"type":"profile","user_id":req.session.user_id};
    mq_client.make_request('viewprofile_queue',msg_payload,function(err,results){
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
}
//function(req,res){
//     var insert_items='SELECT * FROM user where user_id="'+req.session.user_id+'"';
//     //console.log(req.session.user);
//
//     mysql.fetchData(insert_items,function(err,result){
//         if(err){
//             console.log(err);
//
//         }
//         else{
//
//             res.send(result);
//             console.log(result);
//
//
//         }});
// }