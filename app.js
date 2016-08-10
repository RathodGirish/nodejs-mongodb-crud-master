/*
*	Module dependencies
*/
var express     = 	   require('express');
var fs 			= 	   require('fs');
var http 	    = 	   require('http');
var https 	    = 	   require('https');
var path        =  	   require('path');
var util 	    =      require('util');
var bodyParser  =      require('body-parser');
var jsonParser  =      bodyParser.json();
var logger      =      require('morgan');
var mongoose    =      require('mongoose');
var database    =      require('./config/database'); 	// Get configuration file
var static      =      require( 'serve-static' );
var app         =      express();
var routes      =      require('./routes');
var session 	= 	   require('client-sessions');
var config = require('./config/config.json');

//Connection with Database
mongoose.connect(database.url);
var db = mongoose.connection;
//app.engine('jade',engine);
app.set('port', process.env.PORT || config.admin_server_port);
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use( static( path.join( __dirname, 'public' )));
app.use(express.json());
app.use(express.logger('dev'));
app.use(express.multipart());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('secret'));
app.use(express.session());
/*------------Session-------------------- */
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

/*---------------------------------------------------------------------*/
var indexroute				= require('./routes/index');
var commonroute				= require('./routes/commonroute');
var userroute	       		= require('./routes/userroute');
var adminroute				= require('./routes/adminroute');
var countryroute  	   		= require('./routes/countryroute');

/*------------------------------Common Routes--------------------------*/ 
app.get('/getCurrentDate',commonroute.getCurrentDate);
app.get('/ensureUserInSession', commonroute.ensureUserInSession);
app.get('/render', commonroute.render);
app.get('/pushMessage', commonroute.pushMessage);
app.get('/popMessages', commonroute.popMessages);
app.get('/isValidId', commonroute.isValidId);
app.get('/read_write_image',commonroute.read_write_image);

/*---------------------------User Routes------------------------------*/
app.get('/users',userroute.users);
app.get('/getUserById',userroute.getUserById);
app.post('/addUser',userroute.addUser);
app.post('/editUserById/:id',userroute.editUserById);
app.get('/termsAndConditions',userroute.termsAndConditions);
app.get('/removeUserById',userroute.removeUserById);

/*---------------------------Country Route---------------------*/
app.get('/country',countryroute.country);
app.post('/addCountry',countryroute.addCountry);
app.get('/getCountryById',countryroute.getCountryById);
app.post('/editCountryById',countryroute.editCountryById);
app.get('/removeCountryById',countryroute.removeCountryById);

/*-----------------------Admin Route-------------------------------------*/
app.get('/updateProfileView/:id',adminroute.updateProfileView);
app.post('/adminLogin',adminroute.adminLogin);
app.post('/addAdmin',adminroute.addAdmin);
app.post('/editAdminById/:id',adminroute.editAdminById);
app.get('/getAdminById',adminroute.getAdminById);
app.get('/admins',adminroute.admins);
app.get('/removeAdminById',adminroute.removeAdminById);
app.get('/logout',adminroute.logout);

/*-------------------Login------------------------------*/
app.get('/login',indexroute.login);
app.get('/',indexroute.index); //this will show indexpage
//app.post('/login_admin',indexroute.login_admin);//this is used to check authentication for super admin(emaila and password)

var privateKey = fs.readFileSync('config/keys/key.pem').toString();
var certificate = fs.readFileSync('config/keys/msupply.org.crt').toString();

// /*-----------------------------------------------------------*/
// //It Will Start Server on PORT-7070
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
