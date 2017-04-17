// app.js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var session = require('express-session');

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));


//express session set up
var sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false 
};
app.use(session(sessionOptions));

var sessionMovies = [];


// bring in the path module
var path = require("path");
//create a cross-platform compatible path
var publicPath = path.resolve(__dirname, "public");
//use the built-in static files middleware to serve up any file
//in publicPath
app.use(express.static(publicPath));

var db = require('./db');

var mongoose = require('mongoose');
var Movie = mongoose.model('Movie');


app.get('/movies', function(req, res) {

	if (req.session.movies === undefined) {
		req.session.movies = [];
	}

	Movie.find(function (err, movies, count) {

		//filter for director
		var directorFilter = req.query.director;

		//if the query string exists
		if (directorFilter !== undefined) {

			//but the query is empty display all
			if (directorFilter.length === 0) {

				res.render('movies', {movies: movies});

			}
			//filter for director
			else {
				Movie.find({director: directorFilter}, function (err, filter, count) {
					
					res.render('movies', {movies: filter});
				});

			}

		}
		else {

			res.render('movies', {movies: movies});

		}
	});

});

app.get('/movies/add', function(req, res) {

	//new stuff
	var title = req.session.title || '';
	var director = req.session.director || '';
	var year = req.session.year || '';
	//

	res.render('addMovies');

});

app.post('/movies/add', function(req, res) {

	/*req.session.title = req.body.title;
	req.session.director = req.body.director;
	req.session.year = req.body.year; */

	new Movie({

		title: req.body.title,
		director: req.body.director,
		year: req.body.year

	}).save(function(err, movies, count) {
		req.session.movies.push(movies);
		res.redirect('/movies'); 
	});


});

app.get('/mymovies', function(req, res) {

	res.render('mymovies', {'myMovies': req.session.movies});


});





app.listen(3000);
