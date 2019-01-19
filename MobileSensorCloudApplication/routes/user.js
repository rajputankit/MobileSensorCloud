var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/simulation";




exports.user = function(req, res){
	
	if(req.session.email){
		
		res.render("user");		
	}
	else{
		
		res.render("index");
	}	
};




exports.getusersensors = function(req,res){
	
		
	var query = "select * from sensors where sensorlocation = '" + req.param("tariffsensorlocation") + "' and status = 'on'";									
	
	
	mysql.fetchData(function(err, results){
		
		console.log("in fetch data");
		if (err) {
			throw err;
		} 
		else {
			
			console.log(JSON.stringify(results));
			if (results.length > 0) {
				
				console.log("in IF");
				res.end(JSON.stringify(results));				
			}			
		}
	}, query);	
};


exports.addsensortouser = function(req,res){
	
	console.log("in add sensor to user");
	var query = "insert into user_sensors values ('" + req.session.email + "', '" + req.param('sensorid') + "')";									
	
	
	mysql.fetchData(function(err, results){
		
		console.log("in fetch data addsesnortouser");
		if (err) {
			throw err;
		} 
		else {
			
			console.log("sensor added to user");
			res.end();
			if (results.length > 0) {
				
				console.log("in IF");
				res.end(JSON.stringify(results));				
			}			
		}
	}, query);	
};



//exports.getsensordata = function(req,res){
//	
//	var query = "select * from sensors";
//	
//	if(req.session.tariffplan == 1){
//		
//		query = "select * from sensors where sensorlocation = '" + req.session.tariffsensorlocation + "' and status = 'on'";
//		console.log("one " + query);
//	}
//	else if(req.session.tariffplan == 2){
//		
//		query = "select * from sensors where sensorlocation = '" + req.session.tariffsensorlocation + "' OR sensorlocation = '" + req.session.tariffsensorlocation1 + "' and status = 'on'";
//		console.log("one " + query);
//	}
//		
//	
//	
//	mysql.fetchData(function(err, results){
//		
//		console.log("getsensor data : " + JSON.stringify(results));
//		if (err) {
//			throw err;
//		} 
//		else {
//			
//			console.log("getsensordata : " + JSON.stringify(results));
//			
//			if (results.length > 0) {
//				
//				console.log("in IF");
//				res.end(JSON.stringify(results));				
//			}			
//		}
//	}, query);		
//};





exports.updatetariff = function(req,res){
	
	console.log("in updatetariff");
	
	var query;
	
	if(req.param("tariffplan") == 1){
		
		query = "update userinfo set tariffplan = '" + req.param("tariffplan") + "', bill = 49.99 where email = '" + req.session.email + "'";
	}
	else if(req.param("tariffplan") == 2){
		
		query = "update userinfo set tariffplan = '" + req.param("tariffplan") + "', bill = 79.99 where email = '" + req.session.email + "'";
	}
	else if(req.param("tariffplan") == 3){
		
		query = "update userinfo set tariffplan = '" + req.param("tariffplan") + "', bill = 99.99 where email = '" + req.session.email + "'";
	}
	
	
	console.log("query " + query);
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("updated tariffplan");
			req.session.tariffplan = req.param("tariffplan");
			res.end();
		}
	}, query);	
};



exports.updatetariffsensorlocation = function(req,res){
	
	console.log("in updatetarifflocation");
	
	if(req.session.tariffplan == 1){
		
		query = "update userinfo set sensorlocation = '" + req.param("tariffsensorlocation") + "' where email = '" + req.session.email + "'";
	}
	else if(req.session.tariffplan == 2){
		
		query = "update userinfo set sensorlocation = '" + req.param("tariffsensorlocation") + "', sensorlocation1 = '" + req.param("tariffsensorlocation1") + "' where email = '" + req.session.email + "'";
	}
		

	console.log("query " + query);
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("updated tariff location");
			req.session.tariffsensorlocation = req.param("tariffsensorlocation");
			
			if(req.session.tariffplan == 2){
				req.session.tariffsensorlocation1 = req.param("tariffsensorlocation1");
			}
			
			res.end();
		}
	}, query);	
};




exports.getuserselfprofile = function(req,res){
	
	mysql.fetchData(function(err, results){
		
		if (err){
			throw err;
		} 
		else {
			
			res.end(JSON.stringify(results));
		}
	}, "select * from userinfo where email = '" + req.session.email + "'");
};



exports.getsensordata = function(req,res){
	
	var sensorids = [];
	
	var query = "select sensorid from sensors";
	
	if(req.session.tariffplan == 1){
		
		query = "select sensorid from sensors where sensorlocation = '" + req.session.tariffsensorlocation + "' and status = 'on'";
		console.log("one " + query);
	}
	else if(req.session.tariffplan == 2){
		
		query = "select sensorid from sensors where sensorlocation = '" + req.session.tariffsensorlocation + "' OR sensorlocation = '" + req.session.tariffsensorlocation1 + "' and status = 'on'";
		console.log("one " + query);
	}
		
	
		
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("SENSOR ID RETREIVED");
			console.log(JSON.stringify(results));
			//res.end();
			if (results.length > 0) {
				
				mongo.connect(mongoURL, function(){
					
					for(var i = 0; i< results.length; i++){
						
						sensorids.push(results[i].sensorid.toString());
					}
					
					console.log(sensorids);
					console.log('Connected to mongo at: ' + mongoURL);

					var coll = mongo.collection('sensorsimulation');

						coll.find({sensorid: {$in: sensorids}}).toArray(function(err, response){
							
							console.log("In getsensordata : " + JSON.stringify(response));	
							
							if (response) {

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