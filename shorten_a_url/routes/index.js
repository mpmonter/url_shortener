var express = require('express');
var router = express.Router();
var app = require('../app');
var base62 = require('base62');
var nonce = require('nonce')();

// var shortUrl = base62.encode(nonce());
// console.log(shortUrl);  //random short url 

// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect('mongodb://127.0.0.1:27017/url', function(err, db) {
//   if (err) {
//     throw err;
//   }; //////********this is defined within the app.js file beacuse it is faster 
//*******************GET HOMEPAGE TO LOAD***************
router.get('/', function(req, res) {
  res.render('index', {title: 'URLShortener'});
  // index.jade needs a form to submit a URL for shortening. Form takes in url to database 
});



router.post('/', function(req, res) {
  	var db = app.get('mongo');  //needed because the mongo module is defined in the app.js file to increase speed


  	var urlToShorten = req.body.userURL;
  	console.log('this is the url you want to shorten: ' + urlToShorten);

  	var shortUrl = base62.encode(nonce());
	console.log('this is your short url: ' + shortUrl);

  	var collection = db.collection('url');  //create a collection ulrs that containes the necessary key value pairs

  	collection.insert({BigURL: urlToShorten, shrunkURL: shortUrl},  function(err, docs) {
  	// collection.count(function(err, count) {
   //    console.log(format("count = %s", count));

    res.redirect('/info/' + shortUrl);
  		
	});
});

//****************info page......how many times the db is clicked will be included along with the short url printed on the screen**********
router.get('/info/:shortUrl', function(req, res) {
	var db = app.get('mongo'); 
 	var collection = db.collection('url');
    shortUrl = req.params.shortUrl;
  	collection.find({'shrunkURL': shortUrl}, function(err, url) {
    res.render('info', {url: shortUrl});
  });
});

//
router.get('/:shortUrl', function(req, res) {
	var db = app.get('mongo'); 
  	var collection = db.collection('url');
    shortUrl = req.params.shortUrl;

  	collection.find({'shrunkURL': shortUrl}, function(err, result) {
  		result.toArray(function(err, url) {

			res.redirect(url[0].BigURL);
	});
  });
});


module.exports = router;
