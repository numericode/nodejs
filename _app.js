var express         = require('express'),
    app             = express(),
	df = require('dateformat'),
    passport        = require('passport'),
    bodyParser      = require('body-parser'),
    session         = require('express-session'),
    auth         	= require('authentication'),
	routing			= require('routing');
	//admin			= require('admin');
 
app.use(express.static('public'));

// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
 
// initialize passport and session for persistent login sessions
app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 
app.use("/", routing);
//app.use("/admin/", admin);

 
// launch the app
app.listen(8088);
console.log("App running at localhost:8088");