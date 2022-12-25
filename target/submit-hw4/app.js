/* Some initialization boilerplate. Also, we include the code from
   routes/routes.js, so we can have access to the routes. Note that
   we get back the object that is defined at the end of routes.js,
   and that we use the fields of that object (e.g., routes.get_main)
   to access the routes. */

var express = require('express');
var routes = require('./routes/routes.js');
var app = express();
app.use(express.urlencoded());

var session = require('express-session');

app.use(session({
	secret: "my app",
	cookie: {}
}));

/* Below we install the routes. The first argument is the URL that we
   are routing, and the second argument is the handler function that
   should be invoked when someone opens that URL. Note the difference
   between app.get and app.post; normal web requests are GETs, but
   POST is often used when submitting web forms ('method="post"'). */

app.get('/', routes.get_login);
app.post('/results', routes.post_results);

// TODO You will need to replace these routes with the ones specified in the handout
app.post('/checklogin', routes.check_login);
app.get('/restaurants', routes.get_restaurants);
app.get('/signup', routes.get_signup);
app.post('/createaccount', routes.check_create_account);
app.get('/logout', routes.check_logout);
app.post('/addrestaurant', routes.add_restaurant);

/* Run the server */

console.log('Author: Nicholas Kuo (nickkuo)');
app.listen(8080);
console.log('Server running on port 8080. Now open http://localhost:8080/ in your browser!');
