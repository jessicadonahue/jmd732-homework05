var express = require('express');
var cookied = require('./cookied.js');
var app = express();
var bodyParser = require('body-parser');
var colorOptions = require('./colors.js');

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));

// TODO:
// implement the function, parseCookies, in cookied.js
// it should parse the incoming "Cookie" header
// into a property called hwCookies on the req object



app.use(cookied.parseCookies);

// TODO:
// implement the function, manageSession, in cookied.js
// it should either fetch the data associated with an
// incoming session id (based on parsed cookies from
// above) or generate a new session id and use
// Set-Cookie to create a cookie with that session id on
// the client side
app.use(cookied.manageSession);

app.get('/', function(req, res) {
    var favColor = req.hwSession.favColor || '#fff';
    res.render('index', {favColor:favColor, 'sessionData':JSON.stringify(req.hwSession, null, 2)});
});

app.get('/preferences', function(req, res) {
    var favColor = req.hwSession.favColor || '#fff';
    var options = colorOptions.map(function(c) {
        c.selected = c.hex === favColor; 
        return c;
    });
    res.render('preferences.hbs', {favColor:favColor, options: options});
});

app.post('/preferences', function(req, res) {
    req.hwSession.favColor = req.body.favColor;
    res.redirect('/preferences');
});

app.listen(3000);
