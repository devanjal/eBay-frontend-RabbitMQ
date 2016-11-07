var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var ObjectID = require('mongodb').ObjectID;
var mq_client = require('../rpc/client');
var log = require('simple-node-logger').createSimpleLogger('user.log');
var log1 = require('simple-node-logger').createSimpleLogger('bid.log');
exports.addcart = function(req,res){
    log.info('User ID : ', req.session.user_id, '   purpose : Added Item to Cart  ', '  Date & Time:  ',new Date().toLocaleString());

    var msg_payload = {"type":"shop","user_id":req.session.user_id ,
        "item_price":req.body.item_price,
        "item_description":req.body.item_description,
        "item_name":req.body.item_name,
        "item_quantity":parseInt(req.body.quantity)+1,
        "ship_location":req.body.ship_location,
        "item_id":req.body.item_id,
        //"bid_value":req.param('bid_value'),
        "seller_name":req.session.first_name+" "+req.session.last_name,
        "item_post_date":req.body.item_post_date};



    mq_client.make_request('shop_queue',msg_payload,function(err,results){
        console.log(results);

        if(err){
            throw err;
        }else{
            if(results.code == 200){
                console.log("User account created."+results);

                res.render('shopping_cart');
            }
            else{
                console.log("User account not created");
                res.send({"status":"Fail"});
            }
        }
    });


};

exports.addToUsersCart = function(req,res){
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('user');

        coll.findOne({email: req.session.email}, function(err, user){
            if (user) {
                var item_id = req.body.item_id;
                var item_quantity = parseInt(req.body.quantity)+1;
                var item_name = req.body.item_name;
                var item_description = req.body.item_description;
                var seller_name = req.body.seller_name;
                var ship_location = req.body.ship_location;
                var item_price = req.body.item_price;

                var item={
                    item_price:item_price,
                    item_description:item_description,
                    item_name:item_name,
                    item_quantity:item_quantity,
                    ship_location:ship_location,
                    seller_name:seller_name,
                    item_id:item_id,
                    //item_price:req.params('cost'),
                }

                console.log(user);
                user.shopping_cart = [];
                user.shopping_cart.push(item);
                console.log(user);
                //console.log(user.shopping_cart);
                json_responses = {"statusCode" : 200};
                res.send(json_responses);

            } else {
                console.log("returned false");
                json_responses = {"statusCode" : 401};
                res.send(json_responses);
            }
        });
    });
};
exports.bidcart = function (req, res) {

    var user_id = req.session.user_id;
    var item_id = req.body.item_id;
    var item_quantity = parseInt(req.body.quantity)+1;
    var item_name = req.body.item_name;
    var item_description = req.body.item_description;
    var seller_name = req.body.seller_name;
    var item_post_date=req.body.item_post_date;
    var ship_location = req.body.ship_location;
    var base_price = req.body.item_price;
    var bid_price= req.body.bid_price;
    var total=parseInt(bid_price)+parseInt(base_price);
    log1.info('User ID : ', req.session.user_id, '   purpose : Bidding For item : ',req.body.item_id,'   Quantity  :  ',item_quantity, '  Bid Price :  ',total, '  Date & Time:  ',new Date().toLocaleString());

    mongo.connect(mongoURL, function(){
        //console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('bid');

        coll.update({itemno:new ObjectID(req.body.item_id),
                'bids.userid':new ObjectID(req.session.user_id)},
            {$set:{'bids.$':{userid:new ObjectID(req.session.user_id),
                bidplaced:total,quantityselected:item_quantity}}},
            function(err, result) {
                if (err)
                {
                    throw err;
                }

                console.log('result:'+JSON.stringify(result) + result.result.nModified);
                if(result.result.nModified == 0)
                {
                    coll.update({itemno:new ObjectID(req.body.item_id)},
                                {$push:{bids:{$each:[{userid:req.session.user_id,bidplaced:total,
                                quantityselected:item_quantity}],$sort:{bidplaced:-1}}}},
                                {upsert:true},function(err, result) {
                            if (err)
                            {
                                throw err;
                            }
                        });
                }


            });
        var x=req.session.first_name;
        var y=req.session.last_name;
        var z=req.session.devanjal;
        res.render('getProduct', {title: 'All Product', fname:x, lname: y, last_login:z});
    });

};
exports.showCart = function (req, res) {
    log.info('User ID : ', req.session.user_id, '   purpose : View Cart  ', '  Date & Time:  ',new Date().toLocaleString());

    var msg_payload = {"type": "cart", "user_id": req.session.user_id};
    mq_client.make_request('cart_queue', msg_payload, function (err, items) {
        if (err) {
            throw err;
        } else {
            console.log(items);
            if (items.length > 0) {
                console.log(items);
                var obj = new Object();
                var total = 0;
                for (var i = 0; i < items.length; i++) {
                    total = total + (items[i].item_price * items[i].item_quantity);
                }
                obj.items = items;

                obj.sum = total;
                var sum = obj.sum;
                console.log(total)
                //   res.send(obj);
            } else {
                console.log("nullaaaaaaaaa");
                var obj = new Object();
                var total = 0;
                obj.sum = total;
                // response.send()
            }
            var json_response = {items: items, sum: total}
            res.send(json_response);


        }
    });
}


exports.remove_item = function (req, res) {
    log.info('User ID : ', req.session.user_id, '   purpose : removed Item  :',req.body.item_id , '  Date & Time:  ',new Date().toLocaleString());

    var msg_payload = {"type":"removecart","item_id":req.body.item_id};



    mq_client.make_request('cart_queue',msg_payload,function(err,results) {
        console.log(results);
        if (err) {
            throw err;
        } else {
            if (results.code == 200) {
                console.log("User account created." + results);

                res.send({"status": "Success"})
            }
            else {
                console.log("User account not created");
                res.send({"status": "Fail"});
            }
        }
    });


};

exports.remove_item1 = function (req, res) {
    var ms = require('mysql');
    var item_id = req.body.item_id;
    var delete_query = "delete from shopping_cart where item_id="+item_id+";";

    mysql.fetchData(delete_query, function (err, result) {
        if(err){
            console.log("error in delete Query");
            throw err;
        }
        mysql.fetchData("select * from advertisement INNER JOIN shopping_cart ON advertisement.item_id = shopping_cart.item_id INNER JOIN " +
            "user ON shopping_cart.user_id = user.user_id where advertisement.item_quantity >= shopping_cart.item_quantit;",
            function (err, rows) {
                if(err){
                    console.log("error in shopping_cart remove query");
                    throw err;
                } else {
                    console.log(rows);
                    //Log page
                    var object_id="ac_id";
                    var description="Add To Cart"
                    var log_sql='insert into user_log(timestamp, user_id, object_id,description) values(now(),"'+req.session.user_id+'","'+object_id+'","'+description+'")';

                    mysql.fetchData(log_sql,function(err,result){
                        if(err){
                            console.log(err);
                        }else{

                        }
                    });
                    var obj = new Object();
                    obj.cartData = rows;

                    var total = 0;
                    for(var i=0; i<rows.length; i++){
                        total = total + rows[i].itemPrice * rows[i].quantity;
                    }
                    obj.cartTotal = total;
                    res.send(obj);
                }
            });
    });

};
exports.checkout = function(req,res)
{
    log.info('User ID : ', req.session.user_id, '   purpose : Checkout  ', '  Date & Time:  ',new Date().toLocaleString());

    res.render('form', { title: 'Credit Card validation'});
}