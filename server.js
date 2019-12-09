// Requiring necessary npm packages
var express     = require( 'express');
var bodyParser  = require("body-parser");
var session     = require("express-session");
var passport    = require("./passport");
var PORT        = process.env.PORT || 8080;
var constants   = require('./src/config/constants');
var app         = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// If test force true

var syncOptions = { force: false };
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
};

// Routes

require("./routes/html-routes")(app);


// Start The Server

app.listen(PORT, function() {
  console.log("Listening on " + PORT);
});



module.exports = app;
