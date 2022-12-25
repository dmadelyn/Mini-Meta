var db = require('../models/database.js');
var CryptoJS = require("crypto-js");
const url = require('url');

// FINAL PROJECT ROUTES

/*
  Search Functionality
*/
var get_all_users = function(req, res) {
  db.getAllUsers(function(err, data) {
    if (err) {
      res.json({error: "Error"});
    } else {
      res.json(data);
    }
  });
};

var get_user = function(req, res) {
  var username = req.body.username;
  db.getUser(username, function(err, data) {
    if (err) {
      res.json({username:null, error: "Error"});
    } else {
      res.json(data);
    }
  });
};

/*
  User Registration + Login
*/
// Register User -- Assumes Valid Inputs
var register_user = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Hashed password
  var hashPassword = CryptoJS.SHA256(password).toString();
  var firstname = req.body.firstName;
  var lastname = req.body.lastName;
  var email = req.body.email;
  var affiliation = req.body.affiliation;
  var birthday = req.body.birthday;
  // Assumes categoryInterest string of comma separated categories
  var categoryInterest = req.body.interests;
  
  categoryInterest = categoryInterest.split(",");

  db.getUser(username, function(err, data) {
    if (err) {
      res.json({username:null, error: "Error"});
    } else {
      if(data.username !== null) {
        res.json({username:null, error: "Error"});
      } else {
        db.addUser(username,hashPassword,firstname,lastname,email,affiliation, birthday, categoryInterest, function(err, data) {
          if (err) {
            res.json({error: err, username: null});
          } else {
            res.json({username: username, success: "True"});
          }
        });
      }
    }
  });
};

// *** LATER HAVE TO DO "LOGGED IN" updates ***
// *** LATER MUST CHECK IF USERNAME ALREADY IS BEING USED ***

// Login (Check Login, Return True or False)
var login_user = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  // Hashed password
  var hashPassword = CryptoJS.SHA256(password).toString();

  db.getUser(username, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else if(data) {
      var storedPassword = data.password;
      if(storedPassword == hashPassword) {
        db.updateLoggedIn(username, "Yes", function(err1, data1) {
          if(err1) {
            res.json({error: err1, username: null});
          } else {
            data.loggedIn = "Yes";
            res.json(data);
          }
        });
      } else {
        res.json({username: null, success: "False", error: "Incorrect password."});
      }
    } else {
      res.json({username: null, error: "Username does not exist. Try again."});
    }
  });
};

// Logout (Set User's LoggedIn = False)
var logout_user = function(req, res) {
  var username = req.body.username;
  db.updateLoggedIn(username, "No", function(err1, data1) {
    if(err1) {
      res.json({success: err1});
    } else {
      res.json({success: true});
    }
  });
};

/*
  Home Page / Walls / Post Functionality
*/

var add_post = function(req, res) {
  var author = req.body.author;
  var recipient = req.body.recipient;
  var content = req.body.content;
  db.addPost(author, recipient, content, function(err, data) {
    if(err) {
      res.json({success: err});
    } else {
      res.json({success: true});
    }
  });
};

var get_posts_home_page = function(req, res) {
  var username = req.body.username;
  db.getAllPosts(username, function(err, data) {
    if(err) {
      res.json({success: err});
    } else {
      // Sort posts based on timestamp (Sorted in reverse chronological order)
      data.sort((a,b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
      res.json(data);
    }
  });
};

var get_posts_user_wall = function(req, res) {
  var username = req.body.username;
  db.getAllPosts(username, function(err, data) {
    if(err) {
      res.json({success: err});
    } else {
      var outputList = [];
      data.forEach(post => {
        if(post.author === username || post.recipient === username) {
          outputList.push(post);
        }
      });
      // Sort posts based on timestamp (Sorted in reverse chronological order)
      
      outputList.sort((a,b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
      res.json(outputList);
    }
  });
};

var add_comment_to_post = function(req, res) {
  // authorAndTimePost = "author,timestamp" for post
  var authorAndTimePost = req.body.authorAndTimePost;
  var authorOfComment = req.body.authorOfComment;
  var content = req.body.content;
  db.addComment(authorAndTimePost, authorOfComment, content, function(err, data) {
    if(err) {
      res.json({success: err});
    } else {
      res.json({success: true});
    }
  });
};

var get_post_comments = function(req, res) {
  var authorAndTime = req.body.authorAndTime;
  db.getPostComments(authorAndTime, function(err, data) {
    if(err) {
      res.json({success: err});
    } else {
      res.json(data);
    }
  });
}


/*
  Account Changes
*/
// Change Email
var update_email = function(req, res) {
  var username = req.body.username;
  var email = req.body.email;
  db.updateEmail(username, email, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      res.json({username: username, success: "True"});
    }
  });
};

// Change Affiliation
var update_affiliation = function(req, res) {
  var username = req.body.username;
  var affiliation = req.body.affiliation;
  db.updateAffiliation(username, affiliation, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      res.json({username: username, success: "True"});
    }
  });
};

// Change Interests
var update_categories = function(req, res) {
  var username = req.body.username;
  // Assumes categoryInterest is a string of comma separated categories
  var categoryInterest = req.body.categoryInterest;
  categoryInterest = categoryInterest.split(",");
  db.updateCategories(username, categoryInterest, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      res.json({username: username, success: "True"});
    }
  });
};

// Change Password
var update_password = function(req, res) {
  var username = req.body.username;
  // Assumes categories is a list of interests
  var password = req.body.password;
  var hashPassword = CryptoJS.SHA256(password).toString();

  db.updatePassword(username, hashPassword, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      res.json({username: username, success: "True"});
    }
  });
};


/*
  List of Friends
*/
// Add friend
var add_friend = function(req, res) {
  // Assumes categories is a list of interests
  var username = req.body.username;
  var newFriend = req.body.newFriend;

  db.addFriend(username, newFriend, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      res.json({username: username, success: "True"});
    }
  });
};

// Remove friend
var remove_friend = function(req, res) {
  // Assumes categories is a list of interests
  var username = req.body.username;
  var oldFriend = req.body.oldFriend;

  db.removeFriend(username, oldFriend, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      res.json({username: username, success: "True"});
    }
  });
};

// Get all friends
var get_user_friend = function(req, res) {
  // Assumes categories is a list of interests
  var username = req.body.username;
  db.getAllFriends(username, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      // Returns list of JSONs (each JSON is a friend)
      res.json(data);
    }
  });
};

// Get all friends
var get_user_friend_for_chat = function(req, res) {
  // Assumes categories is a list of interests
  var username = req.body.username;
  db.getAllFriendsForChat(username, function(err, data) {
    if (err) {
      res.json({error: err, username: null});
    } else {
      // Returns list of JSONs (each JSON is a friend)
      var ret = [];

      data.forEach(friend => {
        if (friend.user !== username) {
          ret.push(friend);
        }
      });

      res.json(ret);
    }
  });
};



var get_user_chats = function(req, res) {
  var username = url.parse(req.url, true).query.user;
  db.getChatIDs(username, function(err, data) {
    if (err) {
      res.json({error: err, chatIDs: null});
    } else {
      res.json(data);
    }
  })
}

var get_messages = function(req, res) {
  var chatID = url.parse(req.url, true).query.room;
  db.getMessages(chatID, function(err, data) {
    if (err) {
      res.json({error: err});
    } else {
      res.json(data);
    }
  })
}

var add_to_chat = function(req, res) {
  var username = req.body.username;
  var chatID = req.body.chatID;
  var members = req.body.members;

  db.getUser(username, function(err, data) {
    if (err) {
      res.json({response:"Error adding to chatroom"});
    } else {
      if (data.chatIDs.filter(e => e.M.chatID.S === chatID).length === 0) {
        db.addChatID(username, chatID, members.map(x => ({"S": x})), function (err, data) {
          if (err || data === null) {
            res.json({message:"Error adding to chat"});
          } else {
            res.json({message:"Success"});
          }
        })
      } else {
        res.json({message:"Already in chatroom"});
      }
    }
  });
}

var delete_user_chat = function (req, res) {
  var username = req.body.username;
  var chatID = req.body.chatID;

  db.deleteChatID(username, chatID, function(err, data) {
    if (err) {
      res.json({response: "Error deleting invite"});
    } else {
      res.json({response: "Success"});
    }
  })
}

var invite_to_chat = function(req, res) {
  var username = req.body.username;
  var chatID = req.body.chatID;
  var members = req.body.members;

  db.getUser(username, function(err, data) {
    if (err) {
      res.json({response:"Error inviting to chat"});
    } else {
      if (data.chatInvites.filter(e => e.M.chatID.S === chatID).length === 0
        && data.chatIDs.filter(e => e.M.chatID.S === chatID).length === 0) {

        db.addChatInvite(username, chatID, members.map(x => ({"S": x})), function (err, data) {
          if (err || data === null) {
            res.json({response:"Error inviting to chat"});
          } else {
            res.json({response:"Success"});
          }
        })
      } else {
        res.json({response:"Already invited"});
      }
    }
  });
}

var get_chat_invites = function(req, res) {
  var username = req.body.username;

  db.getChatInvites(username, function(err, data) {
    if (err) {
      res.json({error: "Error getting chat invites"});
    } else {
      res.json(data);
    }
  })
}

var delete_chat_invite = function (req, res) {
  var username = req.body.username;
  var chatID = req.body.chatID;

  db.deleteChatInvite(username, chatID, function(err, data) {
    if (err) {
      res.json({response: "Error deleting invite"});
    } else {
      res.json({response: "Success"});
    }
  })

}

var get_article_id = function(req, res) {
  var keyword = req.body.keyword;

  db.getArticleID(keyword, function(err, data) {
    if (err) {
      res.json({error: "Error getting articles"});
    } else {
      res.json(data);
    }
  })
}

var get_article_score  = function(req, res) {
  var username = req.body.username;
  var articleID = req.body.articleId;

  db.getArticleScore(username, articleID, function(err, data) {
    res.json(data);
  })
}

var get_article_info = function(req, res) {
  var articleID = req.body.articleId;

  db.getArticleInfo(articleID, function(err, data) {
    if (err) {
      res.json({error: "Error getting article info"});
    } else {
      res.json(data);
    }
  })
}

var get_recommended_article = function(req, res) {
  var username = req.body.username;
  db.getRecommendedArticle(username, function(err, data) {
    if (err) {
      res.json({error: "No recommendation."})
    } else {
      var num = Math.random();
      var s = 0;
      var result;
      for (let i = 0; i < data.length; i++) {
        s += data[i].score;
        if (num < s) {
          result = {articleId: data[i].articleId};
          break;
        }
      }
      db.deleteRecommendedArticle(username, result.articleId, function(err, data){
        if (err) {
        } else {
        }
      })
      res.json(result);
    }
  })
}

var get_article_like = function(req, res) {
  var username = req.body.username;
  var articleId = req.body.articleId;

  db.getArticleLike(username, articleId, function(err, data) {
    if (err) {
      res.json({error: "Error getting like"});
    } else {
      res.json(data);
    }
  })
}

var post_article_like = function(req, res) {
  var username = req.body.username;
  var articleId = req.body.articleId;

  db.postArticleLike(username, articleId, function(err, data) {
    if (err) {
      res.json({error: "Error posting like"});
    } else {
      res.json({success: "Success!"});
    }
  })
}

var delete_article_like = function(req, res) {
  var username = req.body.username;
  var articleId = req.body.articleId;

  db.deleteArticleLike(username, articleId, function(err, data) {
    if (err) {
      res.json({error: "Error deleting like"});
    } else {
      res.json({success: "Success!"});
    }
  })
}

// OLD ROUTES
var getMain = function(req, res) {
  res.render('main.ejs', {});
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
}
};

// TODO Don't forget to add any new functions to this class, so app.js can call them. (The name before the colon is the name you'd use for the function in app.js; the name after the colon is the name the method has here, in this file.)
var routes = { 
  // FINAL PROJECT ROUTES
  getAllUsers: get_all_users,
  getUser: get_user, 
  registerUser : register_user,
  loginUser : login_user,
  updateEmail : update_email,
  updateAffiliation : update_affiliation,
  updateCategories : update_categories,
  updatePassword : update_password,
  addFriend : add_friend,
  removeFriend : remove_friend,
  getUserFriend : get_user_friend,
  getUserFriendForChat: get_user_friend_for_chat,
  logoutUser : logout_user,
  addPost : add_post, 
  getPostsHomePage : get_posts_home_page,
  getPostsUserWall : get_posts_user_wall,
  addCommentToPost : add_comment_to_post,
  getChats: get_user_chats,
  getMessages: get_messages,
  inviteToChat: invite_to_chat,
  getChatInvites: get_chat_invites,
  deleteChatInvite: delete_chat_invite,
  addToChat: add_to_chat,
  deleteChatID: delete_user_chat,
  getPostComments: get_post_comments,
  getArticleID: get_article_id,
  getArticleScore: get_article_score,
  getArticleInfo: get_article_info,
  getRecommendedArticle: get_recommended_article,
  postArticleLike: post_article_like,
  getArticleLike: get_article_like,
  deleteArticleLike: delete_article_like,


  // OLD ROUTES
  get_login: getLogin,
  get_main: getMain,
};

module.exports = routes;
