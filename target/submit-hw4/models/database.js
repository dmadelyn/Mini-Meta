var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var db = new AWS.DynamoDB();

/* The function below is an example of a database method. Whenever you need to 
   access your database, you should define a function (myDB_addUser, myDB_getPassword, ...)
   and call that function from your routes - don't just call DynamoDB directly!
   This makes it much easier to make changes to your database schema. */

// Searches the users table for a specific user (searchTerm)
var myDB_lookup = function(searchTerm, tableName, listOfAttr, callback) {
  console.log('Looking up: ' + searchTerm); 

  var params = {
      KeyConditions: {
        username: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [ { S: searchTerm } ]
        }
      },
      TableName: tableName,
      AttributesToGet: listOfAttr
  };
  
  // Queries for user in database and retrieves password + full name
  db.query(params, function(err, data) {
    if (err) {
	  console.log("ERROR");
      callback(err, null);
    } else {
	  if(data.Items.length == 0){
		callback(err, null);
	} else {
		var output = {
		password: data.Items[0].password.S,
	  	fullName: data.Items[0].fullname.S
	  };
	  console.log(output);
      callback(err, output);
    }
	}

  });
}

// Scans entire restaurants table for all entries
var restaurant_lookup = function(tableName, callback) {
  var params = {
      TableName: tableName,
  };
  var listOutput = [];
  db.scan(params, function(err, data) {
    if (err) {
	  console.log("ERROR");
      callback(err, null);
    } else {
	  if(data.Items.length == 0){
		callback(err, listOutput);
	} else {
	  // Put all elements into a list of jsons for callback handler
	  data.Items.forEach(function(element, index, array){
		var elCurr = {
			name: element.name.S,
			creator: element.creator.S,
			description: element.description.S,
			latitude: element.latitude.S,
			longitude: element.longitude.S
		}
		listOutput.push(elCurr);
	})
      callback(err, listOutput);
    }
	}

  });
}

// Puts new user into users table
var putUserIntoTable = function(tableName, username, password, fullname, callback) {
  var params = {
      Item: {
        "username": {
          S: username
        },
        "password": { 
          S: password
        },
        "fullname": { 
          S: fullname
        }
      },
      TableName: tableName,
      ReturnValues: 'NONE'
  };

  db.putItem(params, function(err, data){
    if (err)
      callback(err)
    else
      callback(null, 'Success')
  });
}

// Puts new restaurant into restaurants table
var putRestarauntIntoTable = function(tableName, name, creator, desc, lat, long, callback) {
  var params = {
      Item: {
        "name": {
          S: name
        },
        "creator": { 
          S: creator
        },
        "description": { 
          S: desc
        },
        "latitude": { 
          S: lat
        },
        "longitude": { 
          S: long
        }
      },
      TableName: tableName,
      ReturnValues: 'NONE'
  };

  db.putItem(params, function(err, data){
    if (err)
      callback(err)
    else
      callback(null, 'Success')
  });
}

/*
var myDB_lookup = function(searchTerm, language, callback) {
  console.log('Looking up: ' + searchTerm); 

  var params = {
      KeyConditions: {
        keyword: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [ { S: searchTerm } ]
        }
      },
      TableName: "words",
      AttributesToGet: [ 'German' ]
  };

  db.query(params, function(err, data) {
    if (err || data.Items.length == 0) {
      callback(err, null);
    } else {
      callback(err, data.Items[0].German.S);
    }
  });
}
*/

// TODO Your own functions for accessing the DynamoDB tables should go here

/* We define an object with one field for each method. For instance, below we have
   a 'lookup' field, which is set to the myDB_lookup function. In routes.js, we can
   then invoke db.lookup(...), and that call will be routed to myDB_lookup(...). */

// TODO Don't forget to add any new functions to this class, so app.js can call them. (The name before the colon is the name you'd use for the function in app.js; the name after the colon is the name the method has here, in this file.)

var database = { 
  lookup: myDB_lookup,
  putUser: putUserIntoTable,
  putRestaurant: putRestarauntIntoTable,
  getRestaurants: restaurant_lookup
};

module.exports = database;
                                        