var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, mysql= require('./routes/mysql')
	//, signup= require('./routes/signup')
	, profile=require('./routes/profile')
	, product=require('./routes/product')
	,getAllUser=require('./routes/getProduct')
	,session = require('express-session')
	,shopping_cart=require('./routes/shopping_cart')
	,user_log=require('./routes/user_log')
	,validation=require('./routes/validation')
	,viewProfile=require('./routes/viewProfile')
	,bid_log=require('./routes/bid_log')
	,tryy=require('./routes/try')
	,order_history=require('./routes/order_history');
var CronJob = require('cron').CronJob;
var mysql=require('./routes/mysql');
var mongo = require('./routes/mongo');
var mongoURL = "mongodb://localhost:27017/ebay";
var mongoStore = require("connect-mongo")(session);
var cronn=require('./routes/cron');
var mongo = require("./routes/mongo");
var log = require('simple-node-logger').createSimpleLogger('user.log');
var mongoURL = "mongodb://localhost:27017/ebay";
var mq_client = require('./rpc/client');
var passport = require('passport');
require('./routes/passport')(passport);





var login = require("./routes/login");

var myaction=require("./routes/myaction");

var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(session({
	secret: 'kotia_just_chill',
	resave: true,
	saveUninitialized: true,
	duration : 30*60*1000,
	activeDuration : 5*60*1000,
	store: new mongoStore({
		url: mongoURL
	})
}));


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/dist',  express.static(__dirname + '/dist'));
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie, cookie');
	res.header("Access-Control-Allow-Credentials", true);
	if (req.method === "OPTIONS") {
		console.log("Server options");
		res.end('');
	} else {
		next();
	}
});




//development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

//GET Requests
app.get('/', routes.index);
app.get('/homepage',routes.redirectToHomepage);
app.get('/signup',routes.signup);
app.get('/login',routes.login);
app.get('/profile', routes.profile);
app.get('/product',product.display);
app.get('/getProduct',routes.getUser);
app.get('/test',getAllUser.getUser);
//app.get('/profile',routes.profile);
app.get('/logout', routes.logout);
app.get('/showCart', routes.show_cart);
app.get('/getCart', shopping_cart.showCart);
app.get('creditcard',routes.getAction);
app.post('/checkout',shopping_cart.checkout);
app.get('/test1',routes.getlog);
app.get('/bid_log',routes.getbidlog);
app.get('/bid_log1',bid_log.getlog);
app.get('/test2',user_log.getlog);
app.get('/sell_history',routes.get_order_history);
app.get('/buy_history',routes.get_buy_history);
app.get('/buylist',order_history.buy_history);
app.get('/viewProfile',viewProfile.viewProfile);
app.get('/view_profile',routes.viewProfile);
app.get('/success',routes.success);
app.get('/try',routes.try);
app.get('/try1',tryy.gettry);
app.post('/k',shopping_cart.addToUsersCart);


//POST Requests
app.post('/validation',validation.getValid);
app.post('/checkSignup',function (req, res, next) {
    passport.authenticate('signup', function (err, user, info) {
        if(err){
            return next(err);
        }
        if(!user){

            return res.send({"status":"Fail"});
        }else {
            log.info('User ID : ', user._id, '   purpose :Login  ', '  Date & Time:  ',new Date().toLocaleString());

            console.log(JSON.stringify(user));
            return res.send({"status":"Success"});
        }
    })(req, res, next);
});
app.post('/checkLogin', function(req, res, next) {
    passport.authenticate('signin', function(err, user, info) {
        if(err) {

            return next(err);
        }

        if(!user) {

            res.send({"status":"Fail"})
        }

        req.logIn(user, {session:false}, function(err) {
            if(err) {
                return next(err);

            }

            req.session.email = user.email;
            req.session.first_name = user.first_name;
            req.session.last_name = user.last_name;
            req.session.user_id = user._id;
            req.session.devanjal = user.last_login;
            log.info('User ID : ', req.session.user_id, '   purpose :Login  ', '  Date & Time:  ',new Date().toLocaleString());
            mongo.connect(mongoURL, function () {
                var coll = mongo.collection('user');
                coll.update({_id:mongo.ObjectId(user._id)},
                				{
                					$set:{last_login: new Date().toLocaleString()}
                				}

                			);
            });

            return res.send(user);
        })
    })(req, res, next);
});
app.post('/products',product.sell);
app.post('/setProfile',profile.setProfile);
//app.post('/logout', login.logout);
app.post('/addcart',shopping_cart.addcart);
app.post('/bidcart',shopping_cart.bidcart);
app.post('/removeCart',shopping_cart.remove_item);
app.get('/order',order_history.post_order_history);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
