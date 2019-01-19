
/**
 * Module dependencies.
 */
  

var express = require('express')
, routes = require('./routes')
, signup = require('./routes/signup')
, signin = require('./routes/signin')
, sensor = require('./routes/sensor')
, admin = require('./routes/admin')
, user = require('./routes/user')
, http = require('http')
, path = require('path');
//, session = require('client-sessions');

var app = express();


//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat', duration: 30 * 60 * 1000}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.configure('development', function(){
  app.use(express.errorHandler());
});



app.get('/', routes.index);
app.get('/signin', function(req,res){res.render("signin");});
app.get('/signup', function(req,res){res.render("signup");});
app.post('/signin', signin.signin);
app.post('/signup', signup.register);

app.get('/signupsensorowner', function(req,res){res.render("signupsensorowner");});

app.get('/admin', admin.admin);
app.get('/sensorowner', function(req,res){if(req.session.email){res.render("sensorowner");}else{res.render("index");}});
app.get('/user', user.user);


app.post('/addsensor', sensor.addsensor);
app.post('/editsensor', sensor.editsensor);
app.post('/removesensor', sensor.removesensor);

app.post('/togglesensor', sensor.togglesensor);

app.get('/getsensors', sensor.getsensors);

app.get('/getusers', admin.getusers);
app.post('/userprofile', function(req,res){req.session.userprofileemail = req.param("useremail");res.end();});
app.get('/userprofile', function(req,res){res.render("adminuserprofile");});
app.get('/getuserprofile', admin.getuserprofile);			


app.get('/getsensorowners', admin.getsensorowners);
app.post('/sensorownerprofile', function(req,res){req.session.sensorownerprofileemail = req.param("sensorowneremail");res.end();});
app.get('/sensorownerprofile', function(req,res){res.render("adminsensorownerprofile");});
app.get('/getsensorownerprofile', admin.getsensorownerprofile);

app.get('/getownersensors', admin.getownersensors);

app.get('/getallsensors', admin.getallsensors);


app.post('/sensorprofile', function(req,res){req.session.sensoridprofile = req.param("sensorid"); res.end();});
app.get('/sensorprofile', function(req,res){res.render("adminsensorprofile");});
app.get('/getsensorprofile', admin.getsensorprofile);

app.post('/getusersensors', user.getusersensors);
app.post('/addsensortouser', user.addsensortouser);
app.get('/getsensordata', user.getsensordata);
app.get('/getuserselfprofile', user.getuserselfprofile);

app.post('/updatetariff', user.updatetariff);
app.post('/updatetariffsensorlocation', user.updatetariffsensorlocation);

app.get('/signout', function(req,res){
	
	req.session.destroy();	
	console.log("Session destroyed");
	res.redirect('/');
});




http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});




