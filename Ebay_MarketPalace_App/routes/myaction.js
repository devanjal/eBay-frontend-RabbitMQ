

exports.getAction = function(req, res){
	console.log("In Credit Card Validation");
  res.render('new', { title: 'Credit Card Validation' });
};