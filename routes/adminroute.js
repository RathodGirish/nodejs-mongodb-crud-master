var model=require('../models/model');
var ADMIN_COLLECTION = model.admin;
var COUNTRY_COLLECTION=model.country;
var ObjectID = require('mongodb').ObjectID;
var async = require("async");
var Common= require('./commonroute');

exports.admins 				= _admins;
exports.adminLogin 			= _adminLogin;
exports.logout 				= _logout;
exports.addAdmin 			= _addAdmin;
exports.removeAdminById 	= _removeAdminById;
exports.getAdminById 		= _getAdminById;
exports.editAdminById 		= _editAdminById;
exports.updateProfileView 	= _updateProfileView;

/*
TODO: GET To List ALL Admin
*/
function _admins(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		async.parallel([ 
			function(callback){
				ADMIN_COLLECTION.find({role:'Super Admin'},function(error,alladmin){
					if(error){
						callback('Error in Retrieving All Admin for All admin page: ' + error);
					} else {
						callback(null,alladmin);
					}
				});
			},
			function(callback){
				var query = {is_deleted:false};
				COUNTRY_COLLECTION.find(query,function(error,allcountry){
					if(error){
						callback('Error in Getting Country : ' + error);
					}else{
						callback(null,allcountry);
					}
				});
			},
		],
		function(error,results){
			if(error){
				console.log('Error in Fetching List of values in all admin page' + error);
				return;
			}
			Common.render(req, res, 'admin', {
	           	alladmin:results[0], 
	           	allcountry:results[1], 
			 	path : req.path,
			 	session : req.session,
			 	caller : caller
	        });
		});
	});
}

/*
TODO: POST To Perform Admin Login
*/
function _adminLogin(req,res,next){
	var email=req.body.txtemail;
	var password=req.body.txtpassword;
	ADMIN_COLLECTION.findOne({email:req.body.txtemail},function(err,user){
		var json = {};
		if(!user){
			json.status='0';
			json.result={'fail' : 'Admin Not found', 'status' : 200};
			res.send(json);
		} else{
			// if(!password == user.password){
			// 		json.status='0';
			// 		json.result={'fail' : 'Invalid Credentials', 'status' : 200};
			// 		res.send(json);
			// } else {
			// 	json.result={'success' : 'Login Successfully', 'status' : 200};
			// 	req.session.user=user;
			// 	res.send(json);
			// }
			
			Common.validatePassword(req, res, password, user.password, function(error, isvalid){
				if(isvalid){
			        if (req.param('remember-me') == 'true'){
			            res.cookie('user', user.user, { maxAge: config.site.maxCookieAge });
			            res.cookie('pass', user.pass, { maxAge: config.site.maxCookieAge });
			        }
			        json.status='0';
					json.result={'success' : 'Login Successfully', 'status' : 200};
					req.session.user=user;
					res.send(json);
				} else {
					json.status='0';
					json.result={'fail' : 'Invalid Credentials', 'status' : 200};
					res.send(json);
				}
			});
		}
	});
}

/*
TODO: GET To View AddAdmin Page
*/
function _logout(req,res,next){
	res.clearCookie('user');
    res.clearCookie('pass');
    req.session.destroy(function(e){ 
    	res.redirect('/login');
    });
}

/*
TODO: POST To Add Admin
*/
function _addAdmin(req,res,next) {
	Common.ensureUserInSession(req, res, function(caller) {
		var fname = (typeof req.body.txtfirstname != 'undefined'? req.body.txtfirstname : "" ) ;
		var lname = req.body.txtlastname;
		var email=req.body.txtemail;
		var password=req.body.txtpassword;
		var city=req.body.txtcityname;
		var state=req.body.txtstatename;
		var country=req.body.country;
		var role='Super Admin';

		Common.saltAndHash(req, res, password, function(endryptedPassword){
			password = endryptedPassword;
		});
		

		var new_admin = new ADMIN_COLLECTION({
			first_name : fname,
			last_name  : lname,
			email      : email,
			password   : password,
			city       : city,
			state      : state,
			country    : country,
			role       : role	
		});

		var query = {
			$or: [ {email: email}, {country: country}],
			role: {$ne: "Super Admin"}
		};

		ADMIN_COLLECTION.find(query, function(err, admin){
			if(admin.length > 0){
				console.log('Admin Already Exist : ' + email + ' or ' + country);
				Common.pushMessage(req, 'fail', 'Admin Already Exist : ' + email + ' Please use diffrent email/country');
				res.redirect("/admins");
			}else{
				new_admin.save(function(err,result){
					if(err){
						console.log('Failed to Add Admin Error : ' + err);
						Common.pushMessage(req, 'fail', 'Failed to Add Admin...!!!');
						res.redirect("/admins");
					} else {
						Common.pushMessage(req, 'success', 'Admin Added Successfully...!!!');
						res.redirect("/admins");	
					}
				});
			}
		});
	});
}

/*
TODO: GET To Remove Admin by Id
*/
function _removeAdminById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var adminId=req.query.adminId;
		ADMIN_COLLECTION.remove({_id:new ObjectID(adminId)},function(error,admin){
			if(error){
				console.log('Failed to Remove Admin Error : '+error);
				Common.pushMessage(req, 'fail', 'Failed to Remove Admin...!!!');
				res.send(error);
			}else{
				Common.pushMessage(req, 'success', 'Admin Removed Successfully...!!!');
				res.send(admin);
			}		
		});
	});
}

/*
TODO: GET To Get Admin By Id
*/
function _getAdminById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var adminId = req.query.adminId;	
		ADMIN_COLLECTION.find({_id: new ObjectID(adminId)},function(err, admin){
			if(err){
				console.log('Error in Getting amdin by Id : ' + err);
				res.send(err);
			}else{
				res.send(admin);
			}
		});
	});
}

/*
TODO: POST To Edit Admin by Id
*/
function _editAdminById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var adminId = req.param('id');
		var fname = req.body.txtfirstname ;
		var lname = req.body.txtlastname;
		var password=req.body.txtpassword;
		var city=req.body.txtcityname;
		var state=req.body.txtstatename;
		var country=req.body.country;

		Common.saltAndHash(req, res, password, function(endryptedPassword){
			password = endryptedPassword;
		});
		
		var update_obj = {
			first_name:fname,
			last_name:lname,
			password:password,
			city:city,
			state:state,
			country:country
		}

		ADMIN_COLLECTION.update({_id:new ObjectID(adminId)}, {$set:update_obj},
			function(err,result){
			if(err){
				console.log('Failed to Update Admin Error : ' + err);
				Common.pushMessage(req, 'fail', 'Failed to Update Admin...!!!');
				res.redirect('/admins');
			}else{
				Common.pushMessage(req, 'success', 'Admin Updated Successfully...!!!');
				res.redirect('/admins');
			}
		});
	});
}

/*
TODO: GET To List ALL Admin
*/
function _updateProfileView(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var adminId = req.param('id');	
		ADMIN_COLLECTION.find({_id: new ObjectID(adminId)},function(err, admin){
			if(err){
				console.log('Error in Getting amdin by Id : ' + err);
				res.send(err);
			}else{
				Common.render(req, res, 'profile', {
		           	admin:admin[0], 
				 	path : req.path,
				 	session : req.session,
				 	caller : caller
		        });
			}
		});
	});
}
