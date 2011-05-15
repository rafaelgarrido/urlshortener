
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// database connection
var db = require('mongoose').createConnection('mongodb://localhost/urlshortener');

// models
var UrlModel = require('./models/url.js').Model(db);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.logger());
  app.use(express.errorHandler()); 
});

// Routes

// Home
app.get('/', function(req, res){
  res.render('index', {
    title: 'Rafa URL Shortener',
    short_url: ''
  });
});

// New URL
app.post('/', function(req, res){
  var urlshort = new UrlModel();
  urlshort.url = req.body.long_url;
  urlshort.hits = 0;
  urlshort.malicious = false;
  urlshort.save(function(err) {
    if (err)
        console.log(err);
 
    res.render('index', {
      title: 'Rafael URL Shortener',
      short_url: 'http://localhost:3000/ABCD'
    });
  });
});

// Open URL
app.get('/:key', function(req, res){
  console.log('KEY PASSED: ' + req.params.key);
  UrlModel.findOne({key: req.params.key}, function(err, url){
    if (err) console.log(err)
    else {
      console.log(url);
      url.save(function(err) {
        if (err) console.log(err);
          console.log(url.hits.valueOf());
          res.redirect(url.url);
      });
    }
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Rafa URL Shortener - Express server listening on port %d", app.address().port);
}
