	var mysql = require('./mysql');

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.register = function(req,res){
	
	var email = req.body[0].email;
	var name = req.body[0].name;
	var password = req.body[0].password;
	var mobile = req.body[0].mobile;
	var usertype = req.body[1];						//1 - admin , 2- owner ,3-user
	var tariffplan = req.body[0].tariffplan;
	var tariffsensorlocation = req.body[0].tariffsensorlocation;
	var tariffsensorlocation1 = req.body[0].tariffsensorlocation1;
	var bill;
	var query;
	console.log("req" + JSON.stringify(req.body));
	
	if(tariffplan == 1){bill = 49.99;}
	else if(tariffplan == 2){bill = 79.99;}
	else if(tariffplan == 3){bill = 99.99;}
	
	if(usertype == 2){
		
		query = "INSERT INTO userinfo (email, name, password, mobile, usertype) VALUES ('" + email + "','" + name + "','" + password + "','" + mobile + "','" + usertype + "')";
	}
	else if(usertype == 3){
		
		query = "INSERT INTO userinfo (email, name, password, mobile, usertype, tariffplan, sensorlocation, sensorlocation1, bill) " +
				"VALUES ('" + email + "','" + name + "','" + password + "','" + mobile + "','" + usertype + 
				"','" + tariffplan + "','" + tariffsensorlocation + "','" + tariffsensorlocation1 + "','" + bill +"')";
	}
	
	console.log("signup query " + query);
	
	
	mysql.fetchData(function(err, results){
		
		//console.log("in fetch data");
		if (err) {
			throw err;
		} 
		else {
			
			console.log("data inserted");
			req.session.email = email;
			res.end("registered");				
						
		}
		
	}, query);
	
};