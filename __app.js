var xpress = require('express');
var passport = require('passport');
//bodyparser va recuperer les element de l'url pour recuperer les donner du formulaire
var bodyparser = require('body-parser');
var session = require('express-session');
var app = xpress();
//on appel le module que l'on a créé dnas node_module'
var auth = require('authentication');
//on appel le module qui s'ocupe des routes
var routing = require('routing');
//on appel le module qui s'ocupe des routes
var caddie = require('caddierouting');
//pour utiliser un format de date lisible
var df = require('dateformat');
var cfg = require('config');
//var console = require('applog');

//on appel le module qui s'occupe des routes admin
var admin = require('admin');

//pour utiliser les fichiers static css img js
app.use(xpress.static('public'));


//pour utiliser les fichiers static en admin
app.use(xpress.static('public/admin'));

//configuration du module passport

//pour que passport puisse recuperer sous forme de tablo en json le rersultat du formulaire
app.use(bodyparser.json());
//bodyparser accepte utf8
app.use(bodyparser.urlencoded({extended: true}));
//c'est le mot secret pour pouvoir crypter et la persistance dans le serveur avec initialized
app.use(session({secret:"Thissecret",resave:true, saveUminitialized : true}));
// initialise passport tel que confirer
app.use(passport.initialize());
//et demare passport en monde session
app.use(passport.session());

app.use(function timeLog(req, res, next) {
	if(typeof req.user !== 'undefined')
			console.log('Time: ', df(Date.now(), cfg.APP.dateformat), req.ip, req.method, req.user.role, req.user.username ,req.url);
 		else
 			console.log('Time: ', df(Date.now(), cfg.APP.dateformat), req.method, 'anonymous' ,req.url);
  next();
});

// On utilise routing.js dans le node_module, bien le mettre à la fin, car tout est configuré pour faire marché ce qui suit
app.use("/",routing);
//On utilise caddierouting.js dans le node_module, bien le mettre à la fin, car tout est configuré pour faire marché ce qui suit
app.use("/",caddie);
//on utilise la route admin comme redirection avec le fichier admin
app.use("/admin",admin);

//si aucune route n'a été trouvée dans les différents router ci de-dessus
app.use(function(req, res){
	if(typeof req.user == 'undefined'){
		res.status(404).render("404.html.twig");
	}else{
		res.status(404).render("404.html.twig",{"username":req.user.username});
	}
});

app.listen(8088);
