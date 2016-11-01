var mysql= require('./mysql')
var ejs=require('ejs');
var session = require('express-session');
var object_id="vp_id";
exports.post_order_history=function(req,res){
    //if(!req.session){
//var checkLogin='SELECT fname FROM ebay WHERE email="'+req.body.email+'" AND password="'+req.body.password+'"';
    // var insert_items='insert into item values('+req.body.id+',"'+req.body.name+'","'+req.body.desc+'","'+req.body.seller+'","'+req.body.shipAdd+'","'+req.body.cost+'","'+req.body.quantity+'")';
    var insert_items='SELECT * FROM advertisement where seller_id="'+req.session.user_id+'"';
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
exports.buy_history=function(req,res){
   var insert_items='SELECT * FROM order_history where user_id="'+req.session.user_id+'"';
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