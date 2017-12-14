"use strict";
var express=require('express');
var path=require('path');
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var crypto=require('crypto');
var app=express();
mongoose.connect("mongodb://localhost:27017/info");
var ContactSchema=mongoose.Schema({
	name:{type:String,
	        required:true},
	email:{type:String,
	          required:true},
	password:{type:String,
	          required:true}                  
});
var Contact=mongoose.model('Contact',ContactSchema);
app.get('/',function(req,res){
	res.set({"Access-Control-Allow-Origin":"*"});
	return res.redirect('/public/index.html');
}).listen(3000);
console.log("Server is running on port 3000");
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var getHash=function(pass,phone){
	var hmac=crypto.createHmac('sha%12',phone);
	data=hmac.update(pass);
	gen_hmac=data.digest('hex');
	console.log("hmac"+gen_hmac)
	return gen_hmac;
};
app.post('/sign_up',function(req,res){
	let new_contacts=new Contact({
		name:req.body.name,
		email:req.body.email,
		password:req.body.password,
		phone:req.body.phone
	});
	new_contacts.save(function(err,contact){
		if(err)
			res.json("Failed to add contact");
		else

             
	return res.redirect('/public/success.html');  

	});
});
app.get('/savedcontacts',function(req,res){
	Contact.find(function(err,contacts){
		res.json(contacts);
	});
});