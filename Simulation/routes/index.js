	
/*
 * GET home page.
 */
//var csv = require('csv');
var fs = require("fs"),
http = require('http');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/simulation";
var mysql = require('./mysql');

var sensorids = [];
var sensordetails = [];

var sensordata;

exports.index = function(req, res){
	
  res.render('index');
  
};


exports.checknest = function(req, res){
	
	console.log("in checknest");
	
	var Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET","http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=2c4c4cdc97531b58ad9583a761396&q=san+jose,us&date=2015-11-01&enddate=2015-12-03&format=json",false);
	//Httpreq.open("GET","http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=2c4c4cdc97531b58ad9583a761396&q=san+jose,us&date=2015-10-05&format=json",false);
	
	Httpreq.send(null);
	
	sensordata = JSON.parse(Httpreq.responseText);
	
	//console.log("sensor data is " + sensordata);
	//console.log("sensor data is " + JSON.stringify(sensordata));

	console.log("sensor data" + JSON.stringify(sensordata.data.weather[0]));

	
	getsensorids();
	console.log(sensorids);

};


var getsensordata = function(){
	
	mongo.connect(mongoURL, function(){

		console.log("INSIDE");

//		for (var i = 0; i < 50;) {

		for (var j = 0; j < sensorids.length; j++) {

//			var j = 0;
			
			var coll = mongo.collection('sensorsimulation');

			console.log("inserting / updating");
			
			sleep(35000);
			
			coll.update({sensorid: sensorids[j], sensorname: sensordetails[j].sensorname, sensorlocation: sensordetails[j].sensorlocation, sensortype: sensordetails[j].sensortype}, 
					{$push: {sensordata: sensordata}} ,{upsert: true}, function(err, user){
						
						console.log("UPSERTED"); 
						console.log(JSON.stringify(user))
						mongo.close();
					});
			
			//sleep(15000);	    		
			console.log('\n');
			//i++;
		}

//		}	    		
	});	

	
}






var getsensorids = function(req,res){
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			//console.log("simul " + JSON.stringify(results) );
			if (results.length > 0) {
				
				for(var i = 0; i< results.length; i++){
					
					sensorids.push(results[i].sensorid.toString());
					sensordetails = results;
				}
				console.log(sensorids);	
				getsensordata();
			}			
		}
		
	}, "select * from sensors");	
};




function sleep(milliseconds) {
		
	console.log("in sleep");
		getsensorids();	   	
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
		  
	    if ((new Date().getTime() - start) > milliseconds){break;}
	    
	  }
	console.log("waking up");
}














