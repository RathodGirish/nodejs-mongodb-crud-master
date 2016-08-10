var model=require('../models/model');
var USER_COLLECTION=model.user;
var COUNTRY_COLLECTION=model.country;
var ObjectID = require('mongodb').ObjectID;
var async = require("async");
var Common= require('./commonroute');

exports.users  						= _users;
exports.addUser 					= _addUser;
exports.getUserById 				= _getUserById;
exports.editUserById 				= _editUserById;
exports.termsAndConditions 			= _termsAndConditions;
exports.removeUserById 				= _removeUserById;

/*
TODO: GET To Terms and Conditions view
*/
function _termsAndConditions(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		Common.render(req, res, 'termsAndConditions', {
			path : '/users',
			caller: caller,
			session: req.session
        });
	});
}

/*
TODO: GET To View Users
*/
function _users(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		async.parallel([
			function(callback){
				USER_COLLECTION.find(function(error,users){
					if(error){
						callback('Error in Getting users'+error);
					}else{
						callback(null,users);
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
			}
		],
		function(error,results){
			if(error){
				console.log('Error While view users records : ' + error);
				res.redirect('/');
			} else {
				console.log(' results  : ' +  JSON.stringify(results));
				Common.render(req, res, 'user', {
		           	users:results[0], 
		           	allcountry:results[1], 
					path : req.path,
					caller: caller,
					session: req.session
		        });
		    }
		});
	});
}

/*
TODO: POST To Add New User
*/
function _addUser(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var first_name				=req.body.txtfirstname;			
		var last_name				=req.body.txtlastname;
		var email					=req.body.txtemail;	
		var gender					=req.body.Gender;
		var country					=req.body.country;
		var state					=req.body.txtstatename;		
		var city 					=req.body.txtcityname;		
		var status 					=req.body.Status;
		var clinic_name 			=req.body.clinic;
		var mobile_no				=req.body.txtMobile;

		/*---------Creation Date---------------*/
		var creationdate = new Date();
		var user = {};

		if(typeof person_type!='undefined' && person_type=='Treating Patients'){
			user = new USER_COLLECTION({
				first_name				:first_name,
				last_name				:last_name,
				email					:email,
				gender					:gender,
				country					:country,
				state					:state,
				city 					:city,
				user_type				:user_type,
				user_sub_type			:user_sub_type,
				person_type				:person_type,
				first_year_registration	:first_year_registration,
				creation_date			:creationdate,
				status 					:status,
				employer				:'-',
				position				:'-',
				mobile_no				:mobile_no,
				clinic_name				:clinic_name
			});
		} else {
			user = new USER_COLLECTION({
				first_name				:first_name,
				last_name				:last_name,
				email					:email,
				gender					:gender,
				country					:country,
				state					:'-',
				city 					:'-',
				user_type				:'-',
				user_sub_type			:'-',
				person_type				:person_type,
				first_year_registration	:'-',
				creation_date			:creationdate,
				status 					:status,
				employer				:employer,
				position				:position,
				mobile_no				:mobile_no,
				clinic_name				:'-'
			});
		}
		user.save(function(error,user){
			if(error){
				console.log('Failed to Add User Error : ' + error);
				Common.pushMessage(req, 'fail', 'Failed to Add User...!!!');
				res.redirect('/users');
			}else{
				Common.pushMessage(req, 'success', 'User Added Successfully...!!!');
				res.redirect('/users');
			}
		});
	});
}

/*
TODO: POST To Edit User By Id
*/
function _editUserById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {

		var user_id =  req.param('id');
		var first_name				=req.body.txtfirstname;			
		var last_name				=req.body.txtlastname;
		var email					=req.body.txtemail;	
		var gender					=req.body.Gender;
		var country					=req.body.country;
		var state					=req.body.txtstatename;		
		var city 					=req.body.txtcityname;		
		var user_type				=req.body.usertype;		
		var user_sub_type			=req.body.usersubtype;		
		var person_type				=req.body.hidden_persontype;		
		var first_year_registration	=req.body.FirstYearofRegistration;
		var status 					=req.body.Status;
		var clinic_name 			=req.body.clinic;
		var employer				=req.body.txtEmployer;
		var position				=req.body.txtPosition;
		var mobile_no				=req.body.txtMobile;

		/*---------Creation Date---------------*/
		var creationdate = new Date();
		//creationdate = creationdate.toString().replace(/GMT.+/,"");

		var user = {};
		var query = {};
		if(typeof person_type!='undefined' && person_type=='Treating Patients'){
			query = {$set:{
				first_name				:first_name,
				last_name				:last_name,
				email					:email,
				gender					:gender,
				country					:country,
				state					:state,
				city 					:city,
				user_type				:user_type,
				user_sub_type			:user_sub_type,
				person_type				:person_type,
				first_year_registration	:first_year_registration,
				creation_date			:creationdate,
				status 					:status,
				employer				:'-',
				position				:'-',
				mobile_no				:mobile_no,
				clinic_name				:clinic_name
			}};
		} else {
			query = {$set:{country:country,
				first_name				:first_name,
				last_name				:last_name,
				email					:email,
				gender					:gender,
				country					:country,
				state					:'-',
				city 					:'-',
				user_type				:'-',
				user_sub_type			:'-',
				person_type				:person_type,
				first_year_registration	:'-',
				creation_date			:creationdate,
				status 					:status,
				employer				:employer,
				position				:position,
				mobile_no				:mobile_no,
				clinic_name				:'-'
			}};
		}

		USER_COLLECTION.update({_id:new ObjectID(user_id)}, query, function(error,result){
			if(error){
				console.log('Filed to Update User Error : '+error);
				Common.pushMessage(req, 'fail', 'Filed to Update User...!!!');
				res.redirect('/users');
			}else{
				Common.pushMessage(req, 'success', 'User Update Successfully...!!!');
				res.redirect('/users');
			}
		});
	});
}


/*
TODO: GET To Get User By Id
*/
function _getUserById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var userId = req.query.userId;	
		USER_COLLECTION.find({_id: new ObjectID(userId)},function(err, user){
			if(err){
				console.log('Error in Getting User by Id : ' + err);
				res.send(err);
			}else{
				res.send(user);
			}
		});
	});
}

/*
TODO: GET To Remove User By Id
*/
function _removeUserById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var userId = req.query.userId;	
		USER_COLLECTION.remove({_id: new ObjectID(userId)},function(err, user){
			if(err){
				Common.pushMessage(req, 'fail', 'Filed to Remove User...!!!');
				console.log('Error in Removing User by Id : ' + err);
				res.send(err);
			}else{
				Common.pushMessage(req, 'success', 'User Removed Successfully...!!!');
				res.send(user);
			}
		});
	});
}