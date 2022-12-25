/* Some initialization boilerplate. Also, we include the code from
   routes/routes.js, so we can have access to the routes. Note that
   we get back the object that is defined at the end of routes.js,
   and that we use the fields of that object (e.g., routes.get_main)
   to access the routes. */

var express = require('express');
var routes = require('./routes/routes.js');
var app = express();
app.use(express.urlencoded());

app.use(express.json());

var session = require('express-session');

app.use(session({
	secret: "my app",
	cookie: {}
}));

var db = require('./models/database.js');


const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
   console.log(`User Connected: ${socket.id}`);
 
   socket.on("join_room", (data) => {
     socket.join(data);
     console.log(`User with ID: ${socket.id} joined room: ${data}`);
   });
 
   socket.on("send_message", (data) => {
      console.log("Sending to room: " + data.room);
      io.to(data.room).emit("receive_message", data);
      db.addMessage(data.room, data.author, data.content, function(err, data) {});
   });

   socket.on("leave_room", (data) => {
      socket.leave(data);
      console.log(`User with ID: ${socket.id} left room: ${data}`);
   });

   socket.on("send-message", (data) => {
      console.log("emittiing dataaaaaa");
      socket.emit("message", data);
   })
});

/* Below we install the routes. The first argument is the URL that we
   are routing, and the second argument is the handler function that
   should be invoked when someone opens that URL. Note the difference
   between app.get and app.post; normal web requests are GETs, but
   POST is often used when submitting web forms ('method="post"'). */

app.get('/', routes.get_login);

// FINAL PROJECT ROUTES:
app.get('/getAllUsers', routes.getAllUsers);
app.post('/getUser', routes.getUser);
app.post('/registerUser', routes.registerUser);
app.post('/loginUser', routes.loginUser);
app.post('/updateEmail', routes.updateEmail);
app.post('/updateAffiliation', routes.updateAffiliation);
app.post('/updateCategories', routes.updateCategories);
app.post('/updatePassword', routes.updatePassword);
app.post('/addFriend', routes.addFriend);
app.post('/removeFriend', routes.removeFriend);
app.post('/getUserFriend', routes.getUserFriend);
app.post('/getUserFriendForChat', routes.getUserFriendForChat);
app.post('/addPost', routes.addPost);
app.post('/getPostsHomePage', routes.getPostsHomePage);
app.post('/getPostsUserWall', routes.getPostsUserWall);
app.post('/addCommentToPost', routes.addCommentToPost);
app.post('/inviteToChat', routes.inviteToChat);
app.post('/getChatInvites', routes.getChatInvites);
app.post('/deleteChatInvite', routes.deleteChatInvite);
app.post('/addToChat', routes.addToChat);
app.post('/removeFromChat', routes.deleteChatID);
app.post('/getPostComments', routes.getPostComments);
app.post('/logoutUser', routes.logoutUser);
app.post('/getArticleID', routes.getArticleID);
app.post('/getArticleScore', routes.getArticleScore);
app.post('/getArticleInfo', routes.getArticleInfo);
app.post('/getRecommendedArticle', routes.getRecommendedArticle);
app.post('/getArticleLike', routes.getArticleLike);
app.post('/postArticleLike', routes.postArticleLike);
app.post('/deleteArticleLike', routes.deleteArticleLike);




app.get('/getChats', routes.getChats);
app.get('/getMessages', routes.getMessages);

/* Run the server */

console.log('Author: Nicholas Kuo (nickkuo)');
server.listen(8080);
console.log('Server running on port 80. Now open http://localhost:80/ in your browser!');
