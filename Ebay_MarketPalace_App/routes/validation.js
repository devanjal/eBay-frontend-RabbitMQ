var mysql=require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
exports.getValid=function(req,res){
	var object_id=req.body.object_id;
	console.log(object_id);
	var number=req.body.creditcard_length;
	console.log(number);
	var c=req.body.cvv_length;
	var x;
	var y=0;
	var mm=req.body.month_length;
	var yy=req.body.year_length;
	var month=req.body.month;
	var year=req.body.year;
	var flag=0;
	var scard="";
//		var cl=scard.toString().length;
	var scvv="";
//		var cvl=scvv.toString().length;
	var sdate="";
//		var cdl=scard.toString().length;
	if(number!=16){
		scard="invalid card no.";
		flag++;
	}
	if(c!=3){
		scvv="invalid cvv";
		flag++;
	}
	if(year<16 || month>13 || year>26 ||month<1){
		sdate="invalid date";
		flag++;
	}
	if(year==16 && month<10){
		sdate="invalid date";
		flag++;
	}
	if(flag==0) {
		mongo.connect(mongoURL, function () {
			console.log('Connected to mongo at: ' + mongoURL);
			var ad = mongo.collection('advertisement');
			var coll = mongo.collection('shopping_cart');
			var db = mongo.collection('order_history');
			coll.find({"user_id":req.session.user_id}).toArray(function(err, items) {
			//	console.log(items);
					if(items.length > 0){
					console.log(req.session.user_id);
						for(var i = 0; i<items.length; i++){
							console.log("afsdgmvmdf;sdf,xcb;/sd,xc"+items[i].item_quantity)
						//	console.log("afsdg"+items)
							var item_quantity =items[i].item_quantity;
							var ad_id=items[i].item_id;
							ad.find({_id:mongo.ObjectId(ad_id)}).toArray(function(err,result){

									if(result){
										console.log(result);
										var x=result[0].item_quantity;
										var total= x-item_quantity;
										ad.update({_id:mongo.ObjectId(ad_id)},
											{
												$set:{item_quantity:total}
											}

										)
										console.log("fhsajklndfnasdlkgznvasldnzxvlasdlxvzn    Total = "+total);
										ad.remove({item_quantity:0}, function (err,result) {
											if(!err){
												console.log(result)
											}
											else{}

										})
									}
								}
							)
						}

						coll.find({user_id: req.session.user_id}).forEach(function (doc) {
							db.insert(doc);
						});
						coll.remove({user_id: req.session.user_id}, function (err, result) {
							if (err) {
							}
							else {
							}
						});

					}
				}
			)
		});
		var json_repsonse={"statuscode":200};
		res.send(json_repsonse)
	}
	if(flag!=0){
		var json_repsonse={"statuscode":401, "scard":scard, "scvv":scvv,"sdate":sdate}
		res.send(json_repsonse);
	}};

