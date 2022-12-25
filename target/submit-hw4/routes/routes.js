var db = require('../models/database.js');


var getMain = function(req, res) {
  res.render('main.ejs', {});
};

var postResults = function(req, res) {
  var userInput = req.body.myInputField;
  db.lookup(userInput, "german", function(err, data) {
    if (err) {
      res.render('results.ejs', {theInput: userInput, message: err, result: null});
    } else if (data) {
      res.render('results.ejs', {theInput: userInput, message: null, result: data});
    } else {
      res.render('results.ejs', {theInput: userInput, result: null, message: 'We did not find anything'});
    }
  });
};

// Loads Login page, with or without error message included
var getLogin = function(req, res) {
  // If no error, loads login page
  if(Object.keys(req.query).length == 0) {
	res.render('login.ejs', {username: null, message: null, result: null});
} else {
	// If error, loads login page with error message
	var error = req.query.error;
	if(error == 1) {
		res.render('login.ejs', {username: null, message: "Invalid input", result: null});
	} else {
		res.render('login.ejs', {username: null, message: "Invalid username/password", result: null});
	}
	console.log(error);
}
};

// Checks if login/password is valid, if yes logs user in
var checkLogin = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var listOfAttr = [ 'password', 'fullname' ];
  
  // Looks up users to check if username is valid
  db.lookup(username, "users", listOfAttr, function(err, data) {
    if (err) {
      res.redirect('/?error=1');
    } else if (data && data.password == password) {
	  // Logs user in and redirects to restaurant page
	  console.log("Success Login!");
	  req.session.username = username;
	  req.session.fullname = data.fullName;
      res.redirect('/restaurants');
    } else {
      res.redirect('/?error=2');
    }
  });
};

// Populates Restaurant page with all existing restaurants in database
var getRestaurants = function(req, res) {
  // Check if user is logged in, if not, redirect to login
  console.log(req.session.username);
  if(!req.session.username) {
	res.redirect('/');
 } else if(Object.keys(req.query).length != 0) {
	// If error is detected, render restaurants page with error
	db.getRestaurants("restaurants", function(err, data) {
    if (err) {
      res.redirect('/?error=1');
    } else {
      res.render('restaurants.ejs', {fullname: req.session.fullname, table:data, message: "All fields are required to be filled"});
    }
  });
 } else {
	// If no error, query restaurant database for all restaurants to display
	db.getRestaurants("restaurants", function(err, data) {
    if (err) {
      res.redirect('/?error=1');
    } else {
	  console.log(data[0].name);
      res.render('restaurants.ejs', {fullname: req.session.fullname, table:data, message: null});
    }
  });
  	
  }
};

// Renders signup page with or without error messages
var getSignup = function(req, res) {
  if(Object.keys(req.query).length == 0) {
  	res.render('signup.ejs', {username: null, message: null, result: null});
  } else {
	var error = req.query.error;
	if(error == 1) {
		res.render('signup.ejs', {username: null, message: "Sign up form incomplete", result: null});
	} else {
		res.render('signup.ejs', {username: null, message: "Username already exists", result: null});
	}
	console.log(error);
}
};

// Creates new account if username + password is valid
var checkCreateAccount = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var fullname = req.body.fullname;
	
  // Check if there is invalid form inputs
  if(username === '' || password === '' || fullname === '') {
	res.redirect('/signup?error=1');
  } else {
	  // Checks if username exists in database
	  var listOfAttr = [ 'password', 'fullname' ];
	  db.lookup(username, "users", listOfAttr, function(err, data) {
	    if (err) {
	      res.redirect('/signup?error=1');
	    } else if (data) {
		  console.log("Account username already exists");
	      res.redirect('/signup?error=2');
	    } else {
		  console.log("New user being created");
		  
		  // Put new user into users table
		  db.putUser("users", username, password, fullname, function(err, data) {
			if(err) {
				res.redirect('/signup?error=1');
			} else {
				req.session.username = username;
	  			req.session.fullname = fullname;
				res.redirect('/restaurants');
			}
		});
		  
	    }
	  }); 
  }
};

// Deletes session details and redirects to login page
var checkLogout = function(req, res) {
  delete req.session.username;
  delete req.session.fullname;
  console.log(req.session.username);
  res.redirect('/');
};

// Adds new restaurant to restaurants table
var addRestaurant = function(req, res) {
  // Invalid inputs
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var name = req.body.name;
  var description = req.body.description;
  var creator = req.session.username;
  
  // Check if form has invalid inputs
  if(latitude === '' || longitude === '' || name === '' || description === '') {
	res.redirect('/restaurants?error=1');
  } else {
	  // Put new restaurant in restaurant table, then refresh page
	  db.putRestaurant("restaurants", name, creator, description, latitude, longitude, function(err, data) {
			if(err) {
				res.redirect('/restaurants?error=1');
			} else {
				res.redirect('/restaurants');
			}
		}); 
  }
};

// TODO Don't forget to add any new functions to this class, so app.js can call them. (The name before the colon is the name you'd use for the function in app.js; the name after the colon is the name the method has here, in this file.)
var routes = { 
  get_main: getMain,
  post_results: postResults,
  
  // my routes
  get_login: getLogin,
  check_login: checkLogin,
  get_restaurants: getRestaurants,
  get_signup: getSignup,
  check_create_account: checkCreateAccount,
  check_logout: checkLogout,
  add_restaurant: addRestaurant
};

module.exports = routes;
