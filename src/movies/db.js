// db.js

var mongoose = require('mongoose');

//my schema goes here!
mongoose.connect('mongodb://localhost/hw05');
var Movie = new mongoose.Schema({
	title: String,
	year: Number,
	director: String,
});

//use my schema to define my model (used as a constructor
// to create new documents)
mongoose.model("Movie", Movie);


//mongoose.connect('mongodb://localhost/hw05');