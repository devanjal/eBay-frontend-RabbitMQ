var ejs=require('ejs');
var mysql= require('./mysql');
var passwordHash = require("password-hash");
var session = require('express-session');
var mq_client = require('../rpc/client');
exports.setProfile=function(req,res){
   // var sess= req.session;
    var msg_payload = {"type":"editprofile","user_id":req.session.user_id ,
                        "birthday":req.param('dob'),
                        "ebay_handle":req.param('ebay_handle'),
                        "contact":req.param('phone'),
                        "first_name":req.session.first_name+" "+req.session.last_name};

    mq_client.make_request('userprofile_queue',msg_payload,function(err,results){
    	console.log(results);

    	if(err){
    		throw err;
    	}else{
    		if(results.code == 200){
    			console.log("User account created."+results);

    			res.send(results);
    		}
    		else{
    			console.log("User account not created");
    			res.send({"status":"Fail"});
    		}
    	}
    });
    var setProfile= 'UPDATE user SET birthday="'+req.body.dob+'",ebay_handle="'+req.body.ebay_handle+'", contact="'+req.body.phone+'" WHERE email="'+req.session.user+'" AND first_name="'+req.session.first_name+'"';
    // console.log(setProfile)
    // mysql.fetchData(setProfile,function(err,result){
    //     if(err){
    //         console.log(err);
    //         var json_response={"error" : err, "statuscode":401};
    //         res.send(json_response);
    //     }
    //     else{
    //
    //         var object_id="ep_id";
    //         var description="Edit Profile"
    //         var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';
    //
    //         mysql.fetchData(log_sql,function(err,result){
    //             if(err){
    //                 console.log("Log Error"+err);
    //             }else{
    //
    //             }
    //         });
    //
    //         //console.log(fname);
    //         var json_response={"result" : result, "statuscode":200};
    //         //var json_response=result;
    //         res.send(json_response);
    //
    //
    //     }});

};
