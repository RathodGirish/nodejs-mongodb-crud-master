var model = require('../models/model');
var COUNTRY_COLLECTION = model.country;
var PRODUCT_COLLECTION = model.product;
var ObjectID = require('mongodb').ObjectID;
var Common= require('./commonroute');
var async = require("async");

exports.country 				= _country;
exports.addCountry 				= _addCountry;
exports.getCountryById 			= _getCountryById;
exports.editCountryById 		= _editCountryById;
exports.removeCountryById 		= _removeCountryById;

/*
TODO:  To View Country List Page
*/
function _country(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		async.parallel([
			function(callback){
				var query = {is_deleted:false};
				COUNTRY_COLLECTION.find(query, function(error,allcountry){
					if(error){
						callback('Error in Getting Country : ' + error);
					}else{
						callback(null,allcountry);
					}
				});

			},
			function(callback){
				PRODUCT_COLLECTION.distinct("product_name",{is_deleted: false}, function(err,allproduct) {
					if(err){
						callback('Error in Getting Products : ' + error);
					}else{
						callback(null, allproduct);
					}
				});
			}
		],
		function(error,results){
			if(error){
				console.log('Error While view users records : ' + error);
				res.redirect('/');
			} else {
				Common.render(req, res, 'country', {
	                allcountry : results[0], 
	                allproduct : results[1],
					path	   : req.path,
					session    : req.session,
					caller     : caller
	            });
		    }
		});
	});
}

/*
TODO:  To Add Country 
*/
function _addCountry(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var country_name=req.body.txtcountryname;

		var COUNTRY=new COUNTRY_COLLECTION({
			country_name:country_name,
			is_deleted	:false
		});

		COUNTRY_COLLECTION.find({country_name: country_name},function(error,country){
			if(country.length > 0){
				console.log('Failed to Add Country. Country already exists');
				Common.pushMessage(req, 'fail', 'Country "' + country_name + '" already exists. Try with other country name...!!!');
				res.redirect('/country');
			} else {
				COUNTRY.save(function(error,result){
					if(error){
						console.log('Failed to Add Country Error : ' + error);
						Common.pushMessage(req, 'fail', 'Failed to Add Country...!!!');
						res.redirect('/country');
					}else{
						console.log('Country is added Successfully');
						Common.pushMessage(req, 'success', 'Country is added Successfully...!!!');
						res.redirect('/country');
					}
				});
			}
		});
	});
}
/*
TODO:  To Remove Country By  ID
*/
function _removeCountryById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var country_id = req.query.country_id;
		COUNTRY_COLLECTION.update({_id:new ObjectID(country_id)},{$set:{is_deleted: true}},function(error,removecountry){
			if(error){
				console.log('Failed to Remove Country Error : ' + err);
				Common.pushMessage(req, 'fail', 'Failed to Remove Country...!!!');
				res.send(error);
			}else{
				console.log('Country is Removed Successfully');
				Common.pushMessage(req, 'success', 'Country is Removed Successfully...!!!');
				res.send(removecountry);
			}
		});
	});
}

/*
TODO:  To GET Country By Id
*/
function _getCountryById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var country_id = req.query.country_id;
		var result_obj = {};
		result_obj.country = {};
		COUNTRY_COLLECTION.find({_id:new ObjectID(country_id)},function(error,country){
			if(error){
				console.log('Failed to Get Country By Id Error : ' + error);
				res.send(error);
			}else{
				result_obj.country = country;
				console.log(' country  : ' + JSON.stringify(country));
				res.send(result_obj);
			}
		});
	});
}
/*
TODO:  To Edit Country By ID
*/
function _editCountryById(req,res,next){
	Common.ensureUserInSession(req, res, function(caller) {
		var country_id=req.query.country_id;
		var country_name=req.body.txtcountryname;
		console.log(" country_name " + JSON.stringify(country_name));
		
		COUNTRY_COLLECTION.update({_id:new ObjectID(country_id)},{$set:{country_name:country_name, is_deleted:false}},function(error,result){
			if(error){
				console.log('Failed to Update Country Error : ' + err);
				Common.pushMessage(req, 'fail', 'Failed to Update Country...!!!');
				res.redirect('/country');
			}else{
				console.log('Country is Updated Successfully');
				Common.pushMessage(req, 'success', 'Country is Updated Successfully...!!!');
				res.redirect('/country');
			}
		});
	});
}

