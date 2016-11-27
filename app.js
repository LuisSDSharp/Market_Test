var express  = require('express'),
	handlBs  = require('express-handlebars'),
	bdParser = require('body-parser'), 
	greeter  = require('./modules/greet/index'),
	mongo    = require('./modules/mongo/index');

/////////////////////////////////////
//	E X P R E S S
var app = express();
app.use(bdParser.urlencoded({ extended: true }));
app.use(express.static( __dirname + '/public' ));
//////////////////////////////////////

/////////////////////////////////////
//	V I E W   E N G I N E
app.engine('html', handlBs({
	defaultLayout : 'main',
			views : 'views',
		  extname : 'html'
}));
app.set('view engine', 'html');
//////////////////////////////////////

/////////////////////////////////////
//	R O U T E S
app.use('/', mongo);

app.use(function (req, res) {
	res.status(404).send("Unknown route");
});

app.use(function (err, req, res, next) {
	console.log("Error: ", err);
	res.status(500).send("E R R O R");
});
//////////////////////////////////////

var server = app.listen(8080, function() {
	console.log(server.address());
});