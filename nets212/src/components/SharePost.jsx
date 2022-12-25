import React, { useState, useEffect } from 'react';
import { retrieve } from '../getPost';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./SharePost.css"
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Comment from './comment';
import Post from './Post';

function SharePost(props) {
  const [comm, setComm] = useState('');
  const LoginUserName = useSelector((state) => state.user.username);
  const userIds = useSelector((state) => state.user.id);
  const [, setErrMsg] = useState('');
  const dispatch = useDispatch();
  const [person, setPeople] = useState([]);
  const [timeStampNew, setTimeStamp] = useState();
  const routeParams = useParams();
  var [content, setContent] = useState();

  // Add post to backend 
  const addPost = async (e1) => {
    var recipient = props.usernameOfPage;
    var checkIfFriends = props.isFriend;
    const authorOfPost = localStorage.getItem("user");
    
    console.log("Content: " + content);

    if(content == "") {
      alert("Include something in your post!");
      return
    }

    var postJson = {
      author: authorOfPost,
      recipient : recipient,
      content : content,
    }
    
    axios.post('http://3.236.144.208:80/addPost', postJson).then((res) => {
            console.log(res.data);
            document.getElementsByName('formCheck')[0].value = "";
            var ch = [postJson];
            ch = ch.map((temp) => {
              return(
                  <div>
                  <h1></h1>
                  </div>
              );
          });
          setContent("")
          console.log(ch);
            props.pListFunc(ch);
        }).catch((error) => {
            console.log(error)
        });
  };
  
  return (
    <div className = "overcontainer">
      <div className = "wrap">
        <span class="gray2"> <h2>Post Your Thoughts</h2> </span>
        <div className = "topDivShare">
          <div className = "proPicLeft1">
            <img className = "proimg1" src={require("./noAvatar.png")}></img>
            <h3 className="usernameDisplay">{localStorage.user}</h3> 
            &ensp;&ensp;
            <form>
              <input 
                name = "formCheck" 
                id = "formCheck"
                placeholder={props.isFriend ? "Tell others what's on your mind..." : "Add user as friend to post to his/her page"}
                className="shareInput"
                size="200"
                onChange={(e) => setContent(e.target.value)}
              />
              
            </form>
          </div>
          <button className="shareBut" type="submit" onClick = {addPost} disabled={!props.isFriend}>
              Share
          </button>
          &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
        </div>
        
      </div>
    </div>
  );
}

export default SharePost;