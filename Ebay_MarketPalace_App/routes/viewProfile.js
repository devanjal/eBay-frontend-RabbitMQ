var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
exports.viewProfile=function(req,res){
    var insert_items='SELECT * FROM user where user_id="'+req.session.user_id+'"';
    //console.log(req.session.user);

    mysql.fetchData(insert_items,function(err,result){
        if(err){
            console.log(err);

        }
        else{

            res.send(result);
            console.log(result);


        }});
}