var CronJob = require('cron').CronJob;
var connectionpool = require('./connectionpool');
//var bidlog = require('./bidlogger');
var ObjectID = require('mongodb').ObjectID;

function updateBidToUserHistory(detail,connection)
{
    connection.collection('order_history').insertOne(detail,function(err, result) {
        if(err) {
            throw err;
        }
        //res.render("dashboard",{});
    });
}
var job = new CronJob('10 * * * * *', function() {

    console.log("test");
    var someDate = new Date();
    var numberOfDaysToAdd = -4;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
    var twentyMinutesLater = new Date();
    twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 2);

    var connection = connectionpool.getdbconnection();
    connection.collection('advertisement').find({item_post_date:{$lte:twentyMinutesLater},
        bid_value:'true'}).toArray(function (err, result) {
        //console.log({item_post_date:{$lte:twentyMinutesLater},bid_value:'true'});
        //console.log('inside query');
        if (err) {
            console.log(err);
        } else if (result.length) {
            console.log('Found:', result);
        } else {
            console.log('Nothing in Bid');
        }

        for(var r in result)
        {
            var quantity = result[r].item_quantity;
            connection.collection('bid').update({itemno:new ObjectID(result[r]._id)},
                {$push:{bids:{$each:[],
                    $sort:{bidplaced:-1}}}},
                (function(quantity_snapshot,row_snaphot){console.log("[7]"); return function(err, result) {
                if (err)
                {
                    throw err;
                }
                //do something.
                connection.collection('bid').find({itemno:new ObjectID(row_snaphot._id)}).toArray(function (err, bidresult) {
                  //  console.log("[8]"+JSON.stringify(bidresult[0]));
                    var bids = bidresult[0].bids;

                    var deleteflag = false;
                    for(var bid in bids) {
                        console.log('[5] ' + quantity_snapshot);

                        if (bids[bid].quantityselected <= quantity_snapshot) {
                            console.log('[6]');
                            var post = new Object();
                            //post.itemno = row_snaphot.itemno;
                            post.item_name = row_snaphot.item_name;
                           // post.itemdescription = row_snaphot.item_description;
                         //   post.transactiontype = 'Bought';
                          //  post.sellerinformation = row_snaphot.seller_name;
                            post.item_quantity = parseInt(bids[bid].quantityselected);
                            post.item_price = parseFloat(bids[bid].bidplaced);
                            //post.bidding = req.body.bidding;
                            //post.email = null;
                            post.user_id = bids[bid].userid;
                          //  post.dateposted = new Date();
                           // console.log(post.user_id);
                           // bidlog.info('bid won by ', post.userid, ' performed at ', new Date().toJSON(), ' for item ', post.itemno, ' amount placed ', post.itemprice, ' quantity selected ', post.quantity);
                            //update to user history'
                            updateBidToUserHistory(post,connection);

                            if (deleteflag == false) {
                                connection.collection('bid').remove({itemno:new ObjectID(row_snaphot._id)}, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                connection.collection('advertisement').remove({_id: new ObjectID(row_snaphot._id)},
                                    function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                                deleteflag = true;
                            }
                            quantity_snapshot = quantity_snapshot - bids[bid].quantityselected;
                        }
                        else{}
                           // bidlog.info('bid lost by ', bids[bid].userid, ' performed at ', new Date().toJSON(), ' for item ', row_snaphot.itemno, ' amount placed ', bids[bid].bidplaced, ' quantity selected ', bids[bid].quantityselected);
                    }
                });

            }})(quantity,result[r]));
        }
    });

}, null, true, 'America/Los_Angeles');
