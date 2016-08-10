var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
Collection Name :admin
*/
var admin = new Schema({
	first_name 	:  	String,
	last_name  	:  	String,
	email     	:  	String,
	password  	:  	String,
	city      	:  	String,
	state     	:  	String,
	country   	:  	String,
	role      	:   String
}, { collection: 'admin' });
exports.admin = mongoose.model('admin' , admin);

/*
Collection Name :category
*/
var category = new Schema({
	category_name		    :String,
	category_description	:String,
	category_status		    :String,
	is_deleted		    	:Boolean,
	products				:[]
}, { collection: 'category' });
exports.category=mongoose.model('category', category);

/*
Collection Name :product
*/
var	product= new Schema({
	product_name		:String,
	is_deleted		    :Boolean,
	category_id			:String
}, { collection: 'product' });
exports.product=mongoose.model('product', product);

/*
Collection Name :user
*/
var user=new Schema({
	first_name				:String,
	last_name				:String,
	email					:String,
	gender					:String,
	country					:String,
	state					:String,
	city 					:String,
	creation_date			:{ type: Date, default: Date.now },
	status 					:String,
	mobile_no				:String,
	clinic_name				:String

}, { collection: 'user' });
exports.user=mongoose.model('user',user);

/*
Collection Name :bucket
*/
var bucket= new Schema({
	assessment_bucket_name	:String,
	stocktake_bucket_name	:String,
	patient_bucket_name		:String,
	country_name			:String

}, { collection: 'bucket' });
exports.bucket=mongoose.model('bucket',bucket);

/*
Collection Name :country
*/
var country= new Schema({
	country_name	:String,
	is_deleted		:Boolean
}, { collection: 'country' });
exports.country=mongoose.model('country',country);

