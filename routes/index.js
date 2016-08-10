var model= require('../models/model');
var ADMIN_COLLECTION = model.admin;
var COUNTRY_COLLECTION=model.country;
var ObjectID = require('mongodb').ObjectID;
var session = require('client-sessions');
var Common = require('./commonroute');

exports.index = _index;
exports.login = _login;

/*
TODO: GET To Show Dashboard Page
*/
function _index(req,res,next) {
	Common.ensureUserInSession(req, res, function(caller) {
		Common.render(req, res, 'index', {
		 	path : req.path,
		 	caller : caller,
			session: req.session		
        });
	});
}

/*
TODO: GET To Show Login Page
*/
function _login(req,res,next){
	res.render('login', {session: [], messages: []});
}



