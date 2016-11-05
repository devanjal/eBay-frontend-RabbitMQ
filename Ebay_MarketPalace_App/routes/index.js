var ejs=require('ejs');
exports.index = function(req, res){
  var x=req.session.first_name;
  var y=req.session.last_name;
  var z=req.session.devanjal;
  res.render('getProduct', {title: 'All Product', fname:x, lname: y, last_login:z}, function(err, result) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    if(!req.session.user){
    if (!err) {
      res.end(result);
    } else {
      res.end("An error occured");
      console.log(err);
    }}
    else{
      console.log("Not in session");
      res.redirect("/login")
    }
  }) ;
};
exports.getUser=function (req,res) {
 // if(req.session.first_name) {
    var x=req.session.first_name;
    var y=req.session.last_name;
    var z=req.session.devanjal;
    res.render('getProduct', {title: 'All Product', fname:x, lname: y, last_login:z});
  //}
 // else {
   // res.redirect("/login")
 // }
};
exports.login = function(req, res){
  if(!req.session.user) {
    console.log("In Credit Card Validation");
    res.render('login', {title: 'Credit Card Validation'});
  }
  else{
    res.redirect("/")
  }
};
exports.signup = function(req, res){
  ejs.renderFile('./views/signup.html', function(err, result) {
    if (!err) {
      res.end(result);
    } else {
      res.end("An error occured");
      console.log(err);
    }
  }) ;
};
exports.profile = function(req, res){
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  //res.render('profile', { title: 'Edit Profile', user:req.session.user,fname:req.session.first_name });
  if(req.session.user){

      res.render('profile', { title: 'Edit Profile', user:req.session.user,fname:req.session.first_name });

    }
  else{
    console.log("Not in session");
    res.redirect("/login")
  }
};
exports.redirectToHomepage = function(req,res)
{

  res.redirect('/');
  //}
};

exports.logout = function(req,res)
{
  req.session.destroy();
  res.redirect('/login');
};

exports.getAction = function(req, res){
  if(req.session.user) {
    console.log("In Credit Card Validation");
    res.render('form', {title: 'Credit Card Validation'});
  }
  else{
    res.redirect("/login")
  }
};
exports.show_cart = function (req, res) {
  res.render('shopping_cart', function (err, data) {
    if(err){
      console.log("Error in shopping_cart page" + err);
    }else {
      res.end(data);
    }
  });
};
exports.getlog = function(req, res){
  if(req.session.user){
  console.log("Logs");
  res.render('user_log', { title: 'User_log' });}
  else{
    res.redirect("/login")
  }
};
exports.getbidlog = function(req, res){
  if(req.session.user){
    console.log("Logs");
    res.render('bid_log', { title: 'User_log' });}
  else{
    res.redirect("/login")
  }
};
exports.get_order_history = function(req, res){
  // if(req.session.devanjal){
  //console.log("In Credit Card Validation");
    var x=req.session.first_name;
    var y=req.session.last_name;
    var z=req.session.devanjal;
  res.render('order_history', { title: 'order_history', fname:x, lname: y, last_login:z });
//}
  // else{
  //   res.redirect("/login")
  // }
};
exports.get_buy_history = function(req, res){
  if(req.session.user_id) {
    //console.log("In Credit Card Validation");
    var x=req.session.first_name;
    var y=req.session.last_name;
    var z=req.session.devanjal;
    res.render('buy_history', {title: 'order_history', fname:x, lname: y, last_login:z});
  }
  else{
    res.redirect("/login")
  }
  };
exports.viewProfile = function(req, res){
  if(req.session.user){
  //console.log("In Credit Card Validation");
  res.render('viewProfile', { title: 'viewProfile' });}
  else{
    res.redirect("/login")
  }
};
exports.success = function(req, res){
  if(req.session.user_id){
    //console.log("In Credit Card Validation");
    res.render('success', { title: 'Order Placed' });}
  else{
    res.redirect("/login")
  }
};
exports.try = function(req, res){

    //console.log("In Credit Card Validation");
    res.render('try', { title: 'Order Placed' });


};
