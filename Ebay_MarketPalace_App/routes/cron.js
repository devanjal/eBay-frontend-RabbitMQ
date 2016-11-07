var CronJob = require('cron').CronJob;
var mongocon = require('./mongocon');
//var bidlog = require('./bidlogger');
var ObjectID = require('mongodb').ObjectID;

function orderHistory_Update(detail, connection)
{
    connection.collection('order_history').insertOne(detail,function(err, result) {
        if(err) {
            throw err;
        }
    });
}
var job = new CronJob('10 * * * * *', function() {

    console.log("test");
    var date1 = new Date();
    var bidDays = -4;
    date1.setDate(date1.getDate() + bidDays);
    var timeAfter = new Date();
    timeAfter.setMinutes(timeAfter.getMinutes() + 2);

    var connection = mongocon.dbcon();
    connection.collection('advertisement').find({item_post_date:{$lte:bidDays},
        bid_value:'true'}).toArray(function (err, data) {
        if (err) {
            console.log(err);
        } else if (data.length) {
            console.log('Data For Bid', data);
        } else {
            console.log('No Bids');
        }

        for(var q in data)
        {
            var quantity = data[q].item_quantity;
            connection.collection('bid').update({itemno:new ObjectID(data[q]._id)},
                {$push:{bids:{$each:[],
                    $sort:{bidplaced:-1}}}},
                (function(temp_quantity,temp_rows){
                    return function(err, result) {
                if (err)
                {
                    throw err;
                }
                connection.collection('bid').find({itemno:new ObjectID(temp_rows._id)}).toArray(function (err, bid_data) {

                    var bid_total = bid_data[0].bids;

                    var del = false;
                    for(var bidding in bid_total) {
                        console.log(temp_quantity);

                        if (bid_total[bidding].quantityselected <= temp_quantity) {

                            var order = new Object();

                            order.item_name = temp_rows.item_name;
                            order.item_quantity = parseInt(bid_total[bidding].quantityselected);
                            order.item_price = parseFloat(bid_total[bidding].bidplaced);
                            order.user_id = bid_total[bidding].userid;
                            orderHistory_Update(order,connection);

                            if (del == false) {
                                connection.collection('bid').remove({itemno:new ObjectID(temp_rows._id)}, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                connection.collection('advertisement').remove({_id: new ObjectID(temp_rows._id)},
                                    function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                del = true;
                            }
                            temp_quantity = temp_quantity - bid_total[bidding].quantityselected;
                        }
                        else{}
                    }
                });

            }})(quantity,data[q]));
        }
    });

}, null, true, 'America/Los_Angeles');
