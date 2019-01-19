var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/simulation";



exports.admin = function(req, res){
	
	if(req.session.email){
		
		var email = req.session.email + " via index session";
		res.render("admin");		
	}
	else{
		
		res.render("index");
	}	
};








exports.getusers = function(req,res){
	
	var query = "select * from userinfo where usertype = '3'";		
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			if (results.length > 0) {
				console.log("getusers in IF");
				console.log(JSON.stringify(results));
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};


exports.getuserprofile = function(req,res){
	
	var query = "select * from userinfo where email = '" + req.session.userprofileemail + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("userprofile is " + JSON.stringify(results));
			if (results.length > 0) {
				console.log("getuserprofile in IF");
				
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};




exports.getsensorowners = function(req,res){
	
	var query = "select * from userinfo where usertype = '2'";		
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			if (results.length > 0) {
				console.log("getsensorowners in IF");
				console.log(JSON.stringify(results));
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};




exports.getsensorownerprofile = function(req,res){
	
	var query = "select * from userinfo where email = '" + req.session.sensorownerprofileemail + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("sensorownerprofile is " + JSON.stringify(results));
			if (results.length > 0) {
				console.log("getsensorownerprofile in IF");
				
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};


exports.getownersensors = function(req,res){
	
	var query = "select * from sensors where email = '" + req.session.sensorownerprofileemail + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("ownersensors are " + JSON.stringify(results));
			if (results.length > 0) {
				
				console.log("owner sensors in IF");
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};



exports.getsensorprofile = function(req,res){
	
	var query = "select * from sensors where sensorid = '" + req.session.sensoridprofile + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("sensor are " + JSON.stringify(results));
			if (results.length > 0) {
				
				console.log("sensors in IF");
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};



exports.getallsensors = function(req,res){
	
	
	var query = "Select * from sensors";									
	var response = [];
	var sensorids = [];
	
	mysql.fetchData(function(err, results){
		
		console.log("all sensors : " + JSON.stringify(results));
		
		if (err) {
			
			throw err;
		} 
		else{
			
			if (results.length > 0) {
				
				response[0] = results
				//res.end(JSON.stringify(results));
				
				mongo.connect(mongoURL, function(){
					
					for(var i = 0; i< results.length; i++){
						
						sensorids.push(results[i].sensorid.toString());
					}
					
					console.log(sensorids);
					console.log('Connected to mongo at: ' + mongoURL);

					var coll = mongo.collection('sensorsimulation');

						coll.find({sensorid: {$in: sensorids}}).toArray(function(err, result){
							
							console.log("In getsensordata : " + JSON.stringify(result));	
							
							if (result) {

								response[1] = result; 
								res.end(JSON.stringify(response));
							} 
							else {

								res.end("empty");
							}
						});		
				});				
			}			
		}
		
	}, query);	
};





