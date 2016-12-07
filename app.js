var express = require('express');
var app = express();
var passport = require('passport');
var bodyparser = require('body-parser');
var session = require('express-session');
var authentification = require('authentification');
var dateformat = require('dateformat');
var routing = require('routing');
var caddierouting = require('caddierouting');
var cfg = require('config');
//on appel le module qui s'occupe des routes admin
var admin = require('admin');
var df = require('dateformat');

//permet d'utiliser les CSS et images
app.use(express.static('public'));

//pour utiliser les fichiers static en admin
app.use(express.static('public/admin'));

//passport utilise bodyparser pour récupérer le contenu des formulaire sous forme de tableau json
app.use(bodyparser.json());

//cela signifie que bodyparser accepte utf8
app.use(bodyparser.urlencoded({extended: true}));

//permet de crypter les données stockées en session
app.use(session({secret:"Thisissecret", resave:true, saveUninitialized:true}));

//initialise passport tel que configuré
app.use(passport.initialize());

//démarre passport en mode session
app.use(passport.session());

app.use(function(req, res, next){
	var user = 'anonymous';
	if(typeof req.user != 'undefined'){
		user = req.user.username;
		
	}
	console.log('Time :', df(Date.now(), cfg.APP.dateformat),req.method, user, req.url);
	next();
});

//on utilise la route admin comme redirection avec le fichier admin
app.use("/admin",admin);

app.use("/",routing);

app.use("/",caddierouting);


//si aucune route n'a été trouvée dans les différents router ci de-dessus
app.use(function(req, res){
	if(typeof req.user == 'undefined'){
		res.status(404).render("404.html.twig");
	}else{
		res.status(404).render("404.html.twig",{"username":req.user.username});
	}
});
app.listen(8088);