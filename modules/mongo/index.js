var express  = require('express'),
    database = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;

var mongo = express.Router();
var currentCollection = "";

/////////////////////////////////////
//	P R O M I S E   M E
var mongodb = null;
database.connect('mongodb://localhost/test')
    .then(function (db) {
        mongodb = db;
    })
    .catch(function (err) {
        return console.log(err);
    })
//////////////////////////////////////

function PreProcess(req, res, next) {
    console.log("Recived " + req.method + " from " + req.ip);
    next();
}

/////////////////////////////////////
//	C O L L E C T I O N S
mongo.get('/', [PreProcess, function (req, res) {
    mongodb.listCollections().toArray(function (err, collections) {
        if (err) return console.log(err);

        res.render('mongo',
        {
            title: "Databases",
            header: "List of Databases",
            collections: collections
        });
    });
}]);

mongo.post('/createCollection', [PreProcess, function (req, res) {
    mongodb.createCollection(req.body.name, function (err, collection) {
        if (err) return console.log(err);

        console.log("Created " + req.body.name);
        res.redirect('/');
    });
}]);

mongo.get('/removeCollection/:collection', [PreProcess, function (req, res) {
    mongodb.collection(req.params.collection).drop(function (err, result) {
        if (err) return console.log(err);

        console.log("Removed " + req.params.collection + " " + result);
        res.redirect('/');
    });
}]);
//////////////////////////////////////

/////////////////////////////////////
//	D O C U M E N T S
mongo.get('/:collection', [PreProcess, function (req, res) {
    currentCollection = req.params.collection;

    mongodb.collection(currentCollection).find().toArray(function (err, result) {
        if (err) return console.log(err);
        
        res.render('mongo',
        {
            title: currentCollection,
            header: "All records inside " + currentCollection,
            database: result
        });
    });
}]);

mongo.get('/show/:collection/:id', [PreProcess, function (req, res) {
    mongodb.collection(currentCollection).find().toArray(function (err, result) {
        if (err) return console.log(err);
        
        res.render('mongo',
        {
            title: currentCollection,
            header: "All records inside " + currentCollection,
            database: result,
            updateID: req.params.id
        });
    });
}]);

mongo.post('/save', [PreProcess, function (req, res) {
    mongodb.collection(currentCollection).save(req.body, function (err, result) {
        if (err) return console.log(err);

        console.log("Saved " + req.body.name + " in " + currentCollection);
        res.redirect('/' + currentCollection);
    });
}]);

mongo.get('/update/:id', [PreProcess, function (req, res) {
    console.log("/update/" + req.params.id);
    res.redirect('/show/' + currentCollection + '/' + req.params.id);
}]);

mongo.post('/updateDocument/:id', [PreProcess, function (req, res) {
    /*mongodb.collection(currentCollection).update({ _id: req.body.id }, req.body, function (err, result) {
        if (err) return console.log(err);

        console.log("Updated " + req.body.name + " in " + currentCollection);
        res.redirect('/');
    });*/

    console.log("Updated " + req.body.name);
    res.redirect('/' + currentCollection);
}]);

mongo.get('/remove/:id', [PreProcess, function (req, res) {
    mongodb.collection(currentCollection).deleteOne({ _id: new ObjectID(req.params.id) } , function (err, result) {
        if (err) return console.log(err);

        console.log("Removed " + result + " in " + currentCollection);
        res.redirect('/' + currentCollection);
    });
}]);
//////////////////////////////////////

module.exports = mongo;