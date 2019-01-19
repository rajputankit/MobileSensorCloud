
/*
 * GET home page.
 */

exports.index = function(req, res){
	
	if(req.session.email){
		
		if(req.session.usertype == 1){res.render("admin");}
		else if(req.session.usertype == 2){res.render("sensorowner");}
		else if(req.session.usertype == 3){res.render("user");}
		
	}
	else{
	
		res.render('signin');
	}
	
	
  
};