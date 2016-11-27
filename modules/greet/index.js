var express = require('express');

var greeters = express.Router();

/*function greet(req, res, next) {
    res.locals.msg = "Render me this";
    next();
}*/

greeters.get('/', function (req, res) {
    console.log('/greet');

	res.render('greet',
    {
        title: "Greetings Friend",
        header: "You're in GREET page"
    });
});

greeters.get('/:name', function (req, res) {
    console.log('/greet/' + req.params.name);
    
    res.render('greet',
    {
        title: "Greetins " + req.params.name,
        header: "You're in greet page",
        name: req.params.name
    });
});

module.exports = greeters;