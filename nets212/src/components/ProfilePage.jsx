import React, {
  useRef, useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import Header from './header/Header';
import { useParams } from "react-router-dom";
import Post from './Post';
import SharePost from './SharePost';
import UserInfo from './UserInfoFold/UserInfo';
import Wall from './HomeFold/Wall';
import FriendPanel from './FriendPanelFold/FriendPanel';

function ProfilePage() {
  //use the user saved in the current state
  const [auth, setAuth] = useState(localStorage.getItem("authenticated"));
  const routeParams = useParams();
  const otherUser = routeParams.username;
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState('');
  const [pass, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const [, loginStatus] = useState(false);// change to cookie later

  const [loadBool, setLoadBool] = useState(false);

  const [isFriend, setIsFriend] = useState(false);

  let [showChat, setShowChat] = useState(false);
  let [allPosts, setPostList] = useState([]);
  
  let [isYourself, setIsYourself] = useState(false);

  // Removes friend from backend and sets frontend isFriend to false
  const removeFriend = async (e1) => {
    var recipient = routeParams.username;
    const currUsername = localStorage.getItem("user");
    var friendJson = {
      username: currUsername,
      oldFriend : recipient,
    }

    axios.post('http://3.236.144.208:80/removeFriend', friendJson).then((res) => {
          console.log(res.data);
          setIsFriend(false);
        }).catch((error) => {
            console.log(error)
    });
  }

  // Adds friend in database and updates frontend isFriend to true
  const addFriend = async (e1) => {
    var recipient = routeParams.username;
    const currUsername = localStorage.getItem("user");

    var friendJson = {
      username: currUsername,
      newFriend : recipient,
    }
    
    axios.post('http://3.236.144.208:80/addFriend', friendJson).then((res) => {
          console.log(res.data);
          setIsFriend(true);
          var status = currUsername + " and " + recipient + " are now friends!"
          axios.post('http://3.236.144.208:80/addPost', {author: currUsername, recipient: recipient, content: status});
        }).catch((error) => {
            console.log(error)
        });
  };

  // Each refresh, check if current profile page user is friends with logged in user & get profile posts if friends
	useEffect(() => {
        var username1 = routeParams.username;
        setIsYourself(routeParams.username !== localStorage.getItem("user"));

        setUsername(routeParams.username);
        console.log(username1);
        var user1 = {
            username : username1,
        };
        var friendJson = {
          username : localStorage.getItem("user"),
        }
        axios.post('http://3.236.144.208:80/getUserFriend', friendJson).then((res) => {
          var listOfFriends = res.data;
          var isFriends = false;
          listOfFriends.forEach(friendObj => {
            var friend = friendObj.friend;
            if(friend === routeParams.username)  {
              isFriends = true;
            }
          });
          setIsFriend(isFriends);
          setLoadBool(true);
          
          console.log(res.data);
        });

        axios.post('http://3.236.144.208:80/getPostsUserWall', user1).then((res) => {
            console.log(res.data);
            var postList = res.data;
            postList = postList.map((temp) => {
                return(
                    <div>
                    <Post
                    username={temp.author}
                    content={temp.content}
                    likedUserIds={"temp.likedUserIds"}
                    taggedUserIds={"temp.taggedUserIds"}
                    commentList={temp.comments}
                    recipient = {temp.recipient}
                    timestamp = {temp.timestamp}
                    />
                    <br></br>
                    </div>
                );
            });

            

            console.log(postList);
            setPostList(postList);
        }).catch((error) => {
            console.log(error)
        });
	}, []);
 
 
  useEffect(() => {
    setErrMsg('');
  }, [username, pass]);
 

 
  if (!auth) {
    return <Link to = "/login"/>;
  } else {
    return (
      <div>
        <Header />
        
        {loadBool ? (
        <div className="container3">
          <div className="maindiv1"> <pre>          </pre>
          </div>
          <div className="maindiv1">
            <div className="">
              <div className="" id="pp1">
                <br></br><br></br><br></br>
                <img className = "proimg3" src={require("./noAvatar.png")}></img>
              </div>
              <h1 className=""> {username}</h1>

              {isFriend && isYourself?
              <div>
                <button className="shareBut2" type="submit" disabled={true}>
                  Friend Added!
                </button> 
                <button className="shareBut3" type="submit" disabled={false} onClick = {removeFriend}>
                  Remove Friend
                </button> 
              </div>
                : (isYourself ?
                <button className="shareBut2" type="submit" disabled={false} onClick = {addFriend}>
                  Add Friend
                </button> 
                :
                <div></div>
                )
              }
              
              <UserInfo username={username} />

              <br></br>

              <FriendPanel />
            </div>
          </div>
          <div className="maindiv1">
    
            <br></br><br></br>
            

            {(isFriend ? 
            
              <Wall /> 
            
              : 
              <div>
                <div className ="bounceAn">
                <h1 > &emsp;&emsp;&emsp; You're not friends... Lets change that!</h1>
                </div>
                <SharePost isFriend={false}/>
              </div>)
            }
          </div>

           
        </div>
        ) :  <div className="container4"><h1>Page loading...</h1> </div>}

      </div>  
      
    );
  }
 
 
}
export default ProfilePage;
 
 
 
 
