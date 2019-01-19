var ejs = require("ejs");
var mysql = require('./mysql');

exports.index = function(req, res){
	
	if(req.session.email){
		
		var email = req.session.email + " via index session";
		res.render("home", {emailid: email});		
	}
	else{
		
		res.render("index");
	}	
};

exports.signin = function(req,res){
	
	var email = req.body[0].email;
	var password = req.body[0].password; 
	var usertype = req.body[1];						//1 - admin , 2- owner ,3-user
	
	
	var getUser = "select * from userinfo where email ='" + email + "' and password = '" + password + "' and usertype = '" + usertype + "'";
	
	console.log("Query is:" + getUser);		
	
	
	mysql.fetchData(function(err,results){
			
		console.log("result is" + JSON.stringify(results));
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					
					console.log("valid Login");
					req.session.email = email;
					
					
					console.log("session variables : " + req.sessionemail + " " + req.session.tariffplan + " " + req.session.location + " " + req.session.sensorlocation1);
					if(usertype == "1"){
						
						req.session.usertype = 3;
						res.end("admin");
					}
					else if(usertype == "2"){
						
						req.session.usertype = 2;
						res.end("sensorowner");
					}
					else if(usertype == "3"){
						
						req.session.tariffplan = results[0].tariffplan;
						req.session.tariffsensorlocation = results[0].sensorlocation;
						req.session.tariffsensorlocation1 = results[0].sensorlocation1;
						req.session.usertype = 3;
						res.end("user");
					}
				}
				else {    
					
					console.log("WRONG");
					res.end("invalid");
				}
			}  
		},getUser);
};