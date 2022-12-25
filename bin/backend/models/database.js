const { DynamoDB } = require('aws-sdk');
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
var db = new AWS.DynamoDB();

// METHODS FOR FINAL PROJECT:

// (user) check/get user
var getUser = function(username, callback) {
  var params = {
      KeyConditions: {
        username: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{S: username}]
        }
      },
      TableName: "users",
  };
  
  // Queries for user in database and retrieves password + full name
  db.query(params, function(err, data) {
    if (err) {
      callback(err, null);
    } else if(data.Items.length == 0){
        // User does not exist in table
		    callback(null, {username:null});
	  } else {
      // User exists in table (output.categoryInterest[0].S to get category)
		  var output = {
        username: data.Items[0].username.S,
		    password: data.Items[0].password.S,
        firstname: data.Items[0].firstname.S,
        lastname: data.Items[0].lastname.S,
        email: data.Items[0].email.S,
        affiliation: data.Items[0].affiliation.S,
        birthday: data.Items[0].birthday.S,
        categoryInterest: data.Items[0].categoryInterest.L,
        chatIDs: data.Items[0].chatIDs.L,
        chatInvites: data.Items[0].chatInvites.L,
        loggedIn: data.Items[0].loggedIn.S,
	    };
      var l = []
      data.Items[0].categoryInterest.L.forEach(val => {
        l.push(val.S);
      })
      output.categoryInterest = l;
      callback(err, output);
      }
  });
};
// TEST
// getUser("nickkuo", null);

// (user & friends) add user (NOTE: categoryInterest is list of strings, so we preprocess)
var addUser = function(username, password, firstname, lastname, email, affiliation, birthday, categoryInterest, callback) {
  chatIDs = [];
  chatInvites = [];
  categoryInterestDynamoList = []
  categoryInterest.forEach((category) => {
    var newJSON = {"S" : category};
    categoryInterestDynamoList.push(newJSON);
  });

  var params = {
      Item: {
        "username": {S: username},
        "password": {S: password},
        "firstname": {S: firstname},
        "lastname": {S: lastname},
        "email": {S: email},
        "affiliation": {S: affiliation},
        "birthday": {S: birthday},
        "categoryInterest": {L: categoryInterestDynamoList},
        "chatIDs": {L: chatIDs},
        "chatInvites": {L: chatInvites},
        "loggedIn": {S: "Yes"}
      },
      TableName: "users",
      ReturnValues: 'NONE'
  };

  db.putItem(params, function(err, data){
    if (err)
      callback(err)
    else {
      // put item in "friends" table
      var params2 = {
        Item: {
          "username": {S: username},
          "friend": {S: username}
        },
        TableName: "friends",
        ReturnValues: 'NONE'
      };
      db.putItem(params2, function(err2, data){
        if (err2)
          callback(err2)
        else {
          // callback success
          callback(null, "Success");
        }
      });
    }
  });
}

// TEST:
// addUser("sbatta", "sarah", "Sarah", "Batta", "sbatta@gmail.com", "UPenn", "01/13/2001", ["rock", "life"], null);

// (user) update affiliation -- *assumes username is valid
var updateAffiliation = function(username, affiliation, callback) {
  var params = {
    Key: {
      "username" : {S: username}
    },
    UpdateExpression: "set affiliation = :a",
    ExpressionAttributeValues: {
      ":a": {S: affiliation},
    },
    TableName: "users",
  };
  
  db.updateItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
	    console.log(data);
      callback(null, "Success");
    }
  });
};
// TEST
// updateAffiliation("nickkuo", "UPenn ", null);

// (user) update categories (newCategoryInterest is a list of strings)
var updateCategories = function(username, newCategoryInterest, callback) {
  categoryInterestDynamoList = []
  newCategoryInterest.forEach((category) => {
    var newJSON = {"S" : category};
    categoryInterestDynamoList.push(newJSON);
  });
  var params = {
    Key: {
      "username" : {S: username}
    },
    UpdateExpression: "set categoryInterest = :a",
    ExpressionAttributeValues: {
      ":a": {L: categoryInterestDynamoList},
    },
    TableName: "users",
  };
  
  db.updateItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
	    console.log(data);
      callback(err, "Success");
    }
  });
};
// TEST
// updateCategories("nickkuo", ["joe", "biden"], null);

// (user) update email
var updateEmail = function(username, email, callback) {
  var params = {
    Key: {
      "username" : {S: username}
    },
    UpdateExpression: "set email = :a",
    ExpressionAttributeValues: {
      ":a": {S: email},
    },
    TableName: "users",
  };
  
  db.updateItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
	    console.log(data);
      callback(err, "Success");
    }
  });
};
// TEST
// updateEmail("nickkuo", "nicholasjoe@gmail.com", null);

// (user) update password
var updatePassword = function(username, password, callback) {
  var params = {
    Key: {
      "username" : {S: username}
    },
    UpdateExpression: "set password = :a",
    ExpressionAttributeValues: {
      ":a": {S: password},
    },
    TableName: "users",
  };
  
  db.updateItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
	    console.log("Success");
      callback(err, "Success");
    }
  });
};
// TEST
// updatePassword("nickkuo",  "thisIsPassword");

// (user) update loggedIn status (status = "Yes" or "No")
var updateLoggedIn = function(username, status, callback) {
  var params = {
    Key: {
      "username" : {S: username}
    },
    UpdateExpression: "set loggedIn = :a",
    ExpressionAttributeValues: {
      ":a": {S: status},
    },
    TableName: "users",
  };
  
  db.updateItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
	    console.log("Success");
      callback(err, "Success");
    }
  });
};
// TEST
//updateLoggedIn("nickkuo","No",null);


// (user) get all users
var getAllUsers = function(callback) {
  var params = {
    TableName: "users",
  };
  
  db.scan(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      var result = []
	    data.Items.forEach((item) => {
        item['chatIDs'] = item['chatIDs'].L;
        var chat1 = []
        item['chatIDs'].forEach((val) => {
          chat1.push(val.S);
        });
        item['chatIDs'] = chat1;
        item['firstname'] = item['firstname'].S;
        item['lastname'] = item['lastname'].S;
        item['password'] = item['password'].S;
        item['affiliation'] = item['affiliation'].S;
        item['categoryInterest'] = item['categoryInterest'].L;
        var categoryInterest1 = []
        item['categoryInterest'].forEach((val) => {
          categoryInterest1.push(val.S);
        });
        item['categoryInterest'] = categoryInterest1;

        item['chatInvites'] = item['chatInvites'].L;
        var chatInvites1 = []
        item['chatInvites'].forEach((val) => {
          chatInvites1.push(val.S);
        });
        item['chatInvites'] = chatInvites1;

        item['username'] = item['username'].S;
        item['email'] = item['email'].S;
        item['loggedIn'] = item['loggedIn'].S;
        item['birthday'] = item['birthday'].S;

        result.push(item);
      });
      callback(err, result);
    }
  });
};
// TEST
// getAllUsers(null);

// Get all chat ids
var getChatIDs = function(username, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: username }]
      }
    },
    TableName: "users",
  };

  db.query(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else if (data.Items.length == 0) {
        callback(err, "User does not exist");
    } else {
        output = [];
        data.Items[0].chatIDs.L.forEach((val) => {
          var outputJson = {
            chatID: val.M.chatID.S,
            members: val.M.members.L.map(x => x.S)
          };
          output.push(outputJson);
        });
        callback(err, output);
      }
  });
};

// (user) add chatID -- new chat room 
var addChatID = function(username, newChatID, members, callback) {
  console.log(members);
  var params = {
    Key: {
      "username" : {S: username}
    },
    UpdateExpression: "SET chatIDs = list_append(chatIDs, :a)",
    ExpressionAttributeValues: {
      ":a": {"L": [{"M": {"chatID": {"S": newChatID}, "members": {"L": members}}}]},
    },
    TableName: "users",
    ReturnValues: "UPDATED_NEW"
  };
  
  db.updateItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(err, "Success");
    }
  });
};
// TEST
// addChatID("nickkuo",  "13", null);

// (user) delete chatRoom
var deleteChatID = function(username, chatID, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: username }]
      }
    },
    TableName: "users",
  };

  db.query(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else if (data.Items.length == 0) {
        callback(err, "User does not exist");
    } else {
        var chatIDList = data.Items[0].chatIDs.L;
        chatIDList = chatIDList.filter(x => x.M.chatID.S !== chatID);

        var params2 = {
          Key: {
            "username" : {S: username}
          },
          UpdateExpression: "SET chatIDs = :a",
          ExpressionAttributeValues: {
            ":a": {"L": chatIDList},
          },
          TableName: "users",
          ReturnValues: "UPDATED_NEW"
        };

        db.updateItem(params2, function(err, data) {
          if (err) {
            callback(err, null);
          } else {
            callback(err, "Success");
          }
        });


        // var chatIDList = data.Items[0].chatIDs.L;
        // for(var i = 0; i < chatIDList.length; i++) {
        //   chatIDList[i] = chatIDList[i].S;
        // }

        // var index = chatIDList.indexOf(chatID);

        // if(index > -1) {
        //   chatIDList.splice(index, 1);
        //   for(var i = 0; i < chatIDList.length; i++) {
        //     chatIDList[i] = {"S" : chatIDList[i]};
        //   }

        //   var params2 = {
        //     Key: {
        //       "username" : {S: username}
        //     },
        //     UpdateExpression: "SET chatIDs = :a",
        //     ExpressionAttributeValues: {
        //       ":a": {"L": chatIDList},
        //     },
        //     TableName: "users",
        //     ReturnValues: "UPDATED_NEW"
        //   };
          
        //   db.updateItem(params2, function(err, data) {
        //     if (err) {
        //       console.log(err);
        //       callback(err, null);
        //     } else {
        //       console.log("Success");
        //       callback(err, "Success");
        //     }
        //   });
        // } else {
        //   callback(err, "ChatID does not exist");
        // }
      }
  });
};
// TEST
// deleteChatID("nickkuo", "13");


// (user) add chatInvite
var addChatInvite = function(username, chatID, members, callback) {
  var params = {
    Key: {
      "username" : {S: username}
    },
    UpdateExpression: "SET chatInvites = list_append(chatInvites, :a)",
    ExpressionAttributeValues: {
      ":a": {"L": [{"M": {"chatID": {"S": chatID}, "members": {"L": members}}}]},
    },
    TableName: "users",
    ReturnValues: "UPDATED_NEW"
  };
  
  db.updateItem(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(err, "Success");
    }
  });
};
//TEST
//addChatInvite("nickkuo", "19", null);

// (user) delete chatInvite
var deleteChatInvite = function(username, chatID, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: username }]
      }
    },
    TableName: "users",
  };

  db.query(params, function (err, data) {
    if (err) {
      console.log(err);
      // callback(err, null);
    } else if (data.Items.length == 0) {
        // callback(err, "User does not exist");
    } else {
        var chatInviteList = data.Items[0].chatInvites.L;
        chatInviteList = chatInviteList.filter(x => x.M.chatID.S !== chatID);

          var params2 = {
            Key: {
              "username" : {S: username}
            },
            UpdateExpression: "SET chatInvites = :a",
            ExpressionAttributeValues: {
              ":a": {"L": chatInviteList},
            },
            TableName: "users",
            ReturnValues: "UPDATED_NEW"
          };

          db.updateItem(params2, function(err, data) {
            if (err) {
              callback(err, null);
            } else {
              callback(err, "Success");
            }
          });
      }
  });
};
// TEST
// deleteChatInvite("nickkuo", "19", null);

// get all chat invites
var getChatInvites = function(username, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: username }]
      }
    },
    TableName: "users",
  };

  db.query(params, function (err, data) {
    if (err) {
      console.log(err);
        // callback(err, null);
    } else if (data.Items.length == 0) {
        // callback(err, "User does not exist");
    } else {        
        output = [];
        data.Items[0].chatInvites.L.forEach((val) => {
          var outputJson = {
            chatID: val.M.chatID.S,
            inviters: val.M.members.L.map(x => x.S)
          };
          output.push(outputJson);
        });
        callback(err, output);
      }
  });
};

// (friends) get friends -- output: {username: "", friend: ""}
var getAllFriends = function(username, callback) {
  var params = {
      KeyConditions: {
        username: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{S: username}]
        }
      },
      TableName: "friends",
  };
  
  db.query(params, function(err, data) {
    if (err) {
      callback(err, null);
    } else if(data.Items.length == 0){
        // User does not exist in table
		    callback(err, null);
	  } else {
      // iterate through results
      output = [];
      data.Items.forEach((val) => {
        var outputJson = {
          username: val.username.S,
          friend: val.friend.S
        };
        output.push(outputJson);
      });
      
      callback(err, output);
    }
  });
};
// TEST
// getAllFriends("nickkuo", null);

// (friends) get friends -- output: {username: "", friend: ""}
var getAllFriendsForChat = function(username, callback) {
  var params = {
      KeyConditions: {
        username: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{S: username}]
        }
      },
      TableName: "friends",
  };
  
  db.query(params, async function(err, data) {
    if (err) {
      callback(err, null);
    } else if(data.Items.length == 0){
        // User does not exist in table
		    callback(err, null);
	  } else {
      // iterate through results
      output = [];

      data.Items.forEach((val) => {
        output.push(val.friend.S);
      });

      const result = await Promise.all(output.map(name => {
        console.log(name);
        var params = {
          KeyConditions: {
            username: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [{S: name}]
            }
          },
          TableName: "users",
        };

        response = db.query(params).promise().then((res, o) => {
          return {user: res["Items"][0].username.S, online: res["Items"][0].loggedIn.S};
        });

        return response;
      }))
      
      callback(err, result);
    }
  });
};
// TEST
// getAllFriends("nickkuo", null);

// (friends) add friend -- Assumes username and newFriend are valid users
var addFriend = function(username, newFriend, callback) {
  var params = {
      Item: {
        "username": {S: username},
        "friend": {S: newFriend},
      },
      TableName: "friends",
      ReturnValues: 'NONE'
  };

  db.putItem(params, function(err, data){
    if (err)
      callback(err)
    else {
      var params2 = {
        Item: {
          "username": {S: newFriend},
          "friend": {S: username}
        },
        TableName: "friends",
        ReturnValues: 'NONE'
      };
      db.putItem(params2, function(err2, data){
        if (err2)
          callback(err2)
        else {
          // callback success
          callback(null, "Success");
        }
      });
    }
  });
}
// TEST
//addFriend("nickkuo", "sbatta");

// (friends) remove friend
var removeFriend = function(username, friend, callback) {
  var params = {
      Key: {
        "username": {"S" : username},
        "friend": {"S" : friend},
      },
      TableName: "friends",
      ReturnValues: 'NONE'
  };

  db.deleteItem(params, function(err, data){
    if (err) {
      console.log(err);
      callback(err)
    }
    else {
      var params2 = {
        Key: {
          "username": {"S" : friend},
          "friend": {"S" : username},
        },
        TableName: "friends",
        ReturnValues: 'NONE'
      };
  
      db.deleteItem(params2, function(err, data){
        if (err)
          callback(err)
        else
          callback(null, 'Success')
      });
    }
  });
}
// TEST
// removeFriend("nickkuo", "sbatta");

// (posts) add post, can be on own page (recipient = myself) or another page (recipint = another)
var addPost = function(author, recipient, content, callback) {
  var timeOfPost = new Date().getTime().toString();
  console.log(timeOfPost)
  var params = {
      Item: {
        "author": {S: author},
        "timestamp": {S: timeOfPost},
        "recipient": {S: recipient},
        "content": {S: content},
        "likeCount": {N: "0"},
      },
      TableName: "posts",
      ReturnValues: 'NONE'
  };

  db.putItem(params, function(err, data){
    if (err){
      console.log(err);
      callback(err);
    }
    else {
      callback(null, "Success");
    }
  });
}
// TEST
//addPost("nickkuo", "nickkuo", "I just got engaged!");

/*
  Get All Posts: Iterates through all friends, and outputs all of their posts (including your own)
    For home page: Call getAllPosts
    For user A's wall: Call getAllPosts -> Obtain list of posts --> Filter where recipient == user A OR author == user A
*/
var getAllPosts = function(username, callback) {
  // getAllFriends returns data: [{username: , friend: }, ...]
  getAllFriends(username, function(err, data){
    if(err) {
      console.log(err);
      callback(err);
    } else {
      // Iterate through friend list (data) --> finalPromList is list of final promises
      var finalPromList = []
      data.forEach((friendJson) => {
        var postParam = {
          KeyConditions: {
            author: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [{S: friendJson.friend}]
            }
          },
          TableName: "posts",
        };

        // data1: Dynamo list of relevant posts from each friend
        var bigP = db.query(postParam).promise().then(data1 => {
            var postProm = [];
          
            data1.Items.forEach(function(post) {
              // Query for each post's comments
              var outputJson = {
                author: post.author.S,
                timestamp: post.timestamp.S,
                recipient: post.recipient.S,
                content: post.content.S,
                likeCount: post.likeCount.N,
              };
              var authorAndTime = outputJson.author + "," + outputJson.timestamp
              
              var commentParams = {
                KeyConditions: {
                  authorAndTime: {
                    ComparisonOperator: 'EQ',
                    AttributeValueList: [{S: authorAndTime}]
                  }
                },
                TableName: "comments",
              };
              
              // Promise for query
              var x = db.query(commentParams).promise().then(data3 => {
                  // iterate through results
                  var output = [];
            
                  data3.Items.forEach((val) => {
                    var outputJson1 = {
                      authorAndTime: val.authorAndTime.S,
                      author: val.author.S,
                      timestamp: val.timestamp.S,
                      content: val.content.S,
                    };
                    output.push(outputJson1);
                  });
                  outputJson.comments = output;
                  // console.log(outputJson);
                  return outputJson;
              });
              postProm.push(x);
            })
            return Promise.all(postProm);
            
        });
        finalPromList.push(bigP);
      });

      // Process all final promises
      Promise.all(finalPromList).then(finalPostList => {
        var output1 = []
        finalPostList.forEach(postFinal => {
          postFinal.forEach(post => {
            output1.push(post);
          })
        })
        console.log(output1);
        callback(null, output1);
      });
    }
  });
}
// TEST
//getAllPosts("mdemps");

// (comments) add comment to post  -- params: post author + timestamp
var addComment = function(authorAndTimePost, authorOfComment, content, callback) {
  var timestampOfComment = new Date().getTime().toString();

  var params = {
      Item: {
        "authorAndTime": {S: authorAndTimePost},
        "author": {S: authorOfComment},
        "timestamp": {S: timestampOfComment},
        "content": {S: content},
      },
      TableName: "comments",
      ReturnValues: 'NONE'
  };

  db.putItem(params, function(err, data){
    if (err){
      console.log(err);
      callback(err);
    }
    else {
      callback(null, "Success");
    }
  });
}
// TEST
//addComment("nickkuo,1670099461900", "nickkuo", "No problem");

// (comments) get comments -- 
var getPostComments = function(authorAndTime, callback) {
  var params = {
      KeyConditions: {
        authorAndTime: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{S: authorAndTime}]
        }
      },
      TableName: "comments",
  };
  
  db.query(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      // iterate through results
      output = [];
      data.Items.forEach((val) => {
        var outputJson = {
          authorAndTime: val.authorAndTime.S,
          author: val.author.S,
          timestamp: val.timestamp.S,
          content: val.content.S,
        };
        output.push(outputJson);
      });
      
	    console.log(output);
      callback(err, output);
    }
  });
};
// TEST
//getPostComments("nickkuo,1670099461900");

/*
  MESSAGE Database calls
*/
// (messages) get messages -- param: chatID
var getMessages = function(chatID, callback) {
  var params = {
      KeyConditions: {
        chatID: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{S: chatID}]
        }
      },
      TableName: "messages",
  };
  
  db.query(params, function(err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      // iterate through results
      output = [];
      data.Items.forEach((val) => {
        var outputJson = {
          chatID: val.chatID.S,
          author: val.author.S,
          timestamp: val.timestamp.S,
          content: val.content.S,
        };
        output.push(outputJson);
      });
      // Sort messages in ascending order based on timestamp
      output.sort((a,b) => parseFloat(a.timestamp) - parseFloat(b.timestamp));
	    // console.log(output);
      callback(err, output);
    }
  });
};

// (messages) add message -- param: chatID, author, content
var addMessage = function(chatID, author, content, callback) {
  var timestamp = new Date().getTime().toString();
  var params = {
      Item: {
        "chatID": {S: chatID},
        "author": {S: author},
        "timestamp": {S: timestamp},
        "content": {S: content},
      },
      TableName: "messages",
      ReturnValues: 'NONE'
  };

  db.putItem(params, function(err, data){
    if (err){
      console.log(err);
      callback(err);
    }
    else {
      callback(null, "Success");
    }
  });
}

// (messages) delete message -- param: chatID, timestamp
// Assumes this message belongs to the author!
var removeMessage = function(chatID, timestamp, callback) {
  var params = {
      Key: {
        "chatID": {"S" : chatID},
        "timestamp": {"S" : timestamp},
      },
      TableName: "messages",
      ReturnValues: 'NONE'
  };

  db.deleteItem(params, function(err, data){
    if (err) {
      console.log(err);
      callback(err)
    }
    else {
      callback(null, 'Success')
    }
  });
}

/*
  News Feed Routes
*/

// (inverted) Given keyword, GET list of article IDs
var getArticleID = function(keyword, callback) {
  var params = {
      KeyConditions: {
        keyword: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [{S: keyword}]
        }
      },
      TableName: "inverted",
  };
  
  db.query(params, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      var output = [];
      data.Items.forEach((val) => {
        var outputArticle = val.articleId.N;
        var strVersion = ""+ outputArticle;
        output.push(strVersion);
      });
      console.log(output);
      callback(err, output);
      }
  });
};
// getArticleID("newsroom");

// (absorbtionScore) Given username & articleID, GET {articleId, score}
var getArticleScore = function(username, articleId, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{S: username}]
      },
      articleId: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{N: articleId}]
      }
    },
    TableName: "adsorptionScore",
};
  
  db.query(params, function(err, data) {
    if (err) {
      console.log("ERROR:");
      var outputJson = {
        articleId: articleId,
        score : "0",
      }
      console.log(outputJson);
      callback(null, outputJson);
    } else {
      if(data.Items.length === 0) {
        var outputJson = {
          articleId: articleId,
          score : "0",
        }
        callback(null, outputJson);
      } else {
        var outputJson = {
          articleId: articleId,
          score : ""+ data.Items[0].score.N,
        }
        console.log(outputJson);
        callback(null, outputJson);
      }
    }
  });
};
// getArticleScore("ydu241", "14243");

// Given artileId, GET article from article table


// Recommended Article (Absorbtion)
// Given username, GET articleID & date (filter based on date, normalize & randomly choose), absorbtion score 


/*
  LIKES FOR ARTICLES
*/

// Given username & articleID, POST to articleLikes table

// Given username & articleID, GET (and check if response is empty)




// TODO Don't forget to add any new functions to this class, so app.js can call them. (The name before the colon is the name you'd use for the function in app.js; the name after the colon is the name the method has here, in this file.)

var database = { 
  getUser: getUser,
  addUser: addUser,
  updateAffiliation: updateAffiliation,
  updateCategories: updateCategories,
  updateEmail: updateEmail,
  updatePassword: updatePassword,
  updateLoggedIn : updateLoggedIn,
  getAllUsers: getAllUsers,
  getChatIDs: getChatIDs,
  addChatID: addChatID,
  deleteChatID: deleteChatID,
  getChatInvites: getChatInvites,
  addChatInvite: addChatInvite,
  deleteChatInvite: deleteChatInvite,
  getAllFriends: getAllFriends,
  getAllFriendsForChat: getAllFriendsForChat,
  addFriend: addFriend,
  removeFriend: removeFriend,
  addPost: addPost,
  getAllPosts: getAllPosts,
  addComment: addComment,
  getPostComments: getPostComments,
  getMessages: getMessages,
  addMessage : addMessage,
  removeMessage : removeMessage,

};

module.exports = database;
                                        