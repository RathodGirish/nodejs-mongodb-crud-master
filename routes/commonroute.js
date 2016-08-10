var model               = require('../models/model');
var querystring         = require('querystring');
var ObjectID            = require('mongodb').ObjectID;
var crypto              = require('crypto');
var fs                  = require('fs-extra'); 

exports.render              = _render;
exports.ensureUserInSession = _ensureUserInSession;
exports.pushMessage         = _pushMessage;
exports.popMessages         = _popMessages;
exports.saltAndHash         = _saltAndHash;
exports.generateSalt        = _generateSalt;
exports.md5                 = _md5;
exports.validatePassword    = _validatePassword;
exports.getCurrentDate      = _getCurrentDate;
exports.getFormattedDate    = _getFormattedDate;
exports.isSuperAdmin        = _isSuperAdmin;
exports.isValidId           = _isValidId;
exports.getValidString      = _getValidString;
exports.isValidString       = _isValidString;
exports.read_write_image    = _read_write_image;

/*
TODO:To render pages
*/
function _render(req, res, suffix, data) {
	if (req.session.user == null){
    	console.log('req.session.user ' + req.session.user);
        res.redirect('/login');
    } else if(req.session.user.role != null) {
        var path_to_test = suffix;
        data.messages = req.session.messages;
        data.user = req.session.user;
        exports.popMessages(req, suffix);
        res.render(path_to_test, data, function(err, html) {
            if(err) {
                console.log('failed to render ' + suffix + ', message=' + err);
            } else {
                res.end(html);
            }
        });
    } else {
        res.redirect('/login');
    }
}

/*
TODO:To Ensure that user in session or not
*/
function _ensureUserInSession(req,res,userReturnFunction) {
    
    if(req.session.user && req.session.user != null) {
        userReturnFunction(req.session.user);
    } else {
        req.session = null;
        res.redirect('/login');
    }
}

/*
TODO:To Push Message in session
*/
function _pushMessage(req, type, message) {
    
    var current_messages = req.session.messages;
    var msg_array = [];
    if(typeof(current_messages) != 'undefined') {
        for (var i = 0; i < current_messages.length; i++) {
            msg_array.push(current_messages[i]);
        }
        msg_array.push({type: type, message: message});
        req.session.messages = msg_array;
    } else {
        msg_array.push({type: type, message: message});
        req.session.messages = msg_array;
        req.session.messages = [ {type: type, message: message} ];
    }
}


/*
TODO:To Pop Message in session
*/
function _popMessages(req, suffix) {
    if(typeof(req.session.messages) != 'undefined') {
        var messages = req.session.messages;
        req.session.messages = [];
    } else {
        req.session.messages = [];
    }
}

function _generateSalt() {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
    var salt = '';
    for (var i = 0; i < 10; i++) {
        var p = Math.floor(Math.random() * set.length);
        salt += set[p];
    }
    return salt;
};

function _md5(str) {
    var return_str = crypto.createHash('md5').update(str).digest('hex');
    return return_str;
};

function _saltAndHash(req, res, pass, callback) {
    var salt = exports.generateSalt();
    callback(salt + exports.md5(pass + salt));
};

function _validatePassword(req, res, plainPass, hashedPass, callback) {
    var salt = hashedPass.substr(0, 10);
    var validHash = salt + exports.md5(plainPass + salt);
    callback(null, hashedPass === validHash);
};

function _isSuperAdmin(req, res, caller){
    return (caller.role == "Super Admin");
}

/*
TYPE:GET
TODO: To return current date
*/

function _getCurrentDate(str) {
    /*-------------Current Date-------------*/
    var today = new Date();
    return today;
};

/*
TYPE:GET
TODO: To return current date
*/

function _getFormattedDate(date) {
    /*-------------Current Date-------------*/
    var date = new Date(date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return day + '/' + (month+1) + '/' + year + '  ' + hours + ':' +  minutes + ':' + seconds ;
};

var id_regex = new RegExp("^[0-9a-fA-F]{24}$");

function _isValidId(id) {
	if(typeof id!='undefined' && id!=""){
        return id_regex.test(id);
    } else {
        return false;
    }
}

/*
TODO:To Return valid string
*/
function _getValidString(str) {
    if(typeof(str) != 'undefined') {
        return str;
    } else {
        return "";
    }
}

/*
TODO:To Check is valid string or not
*/
function _isValidString(str) {
    if(typeof(str) != 'undefined' && str != "") {
        return true;
    } else {
        return false;
    }
}

/*
TODO:To read and write image. And return unique image name.
*/
function _read_write_image(req, res, image_path, image_name, path, next){
    fs.readFile(image_path, function (err, data) {
        if(!image_name){
            console.log("Error while reading image "+err);
            next('No imagename specified');
        } else {
            var unique_name = new Date().getTime().toString()+'.png';
            var newPath = path + unique_name;
      
            fs.writeFile(newPath, data, function (err) {
                if(err){
                    next(err);
                }else{
                    next(null, unique_name);    
                }
            });

            // gm(image_path)
            // .resize(60, 60)
            // .write(newPath, function (error) {
            //      if (error) {
            //          console.log(" -----------error fff " + JSON.stringify(error));
            //          next(error);
            //      } else {
            //          console.log('done');
            //          next(null, time.toString()+'.png');
            //      }
            // });
        }
    });
}