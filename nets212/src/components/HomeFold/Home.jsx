import React, {useRef, useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import io from "socket.io-client";
import './Home.css';
import Header from '../header/Header';
import Post from '../Post';
import SharePost from '../SharePost';
import Chat from '../chat/Chat';
import axios from 'axios';


function Home() {
    const auth = localStorage.getItem("authenticated");
    const user = localStorage.getItem("user");
    const username = user;
    
    let [allPosts, setPostList] = useState([]);

	useEffect(() => {
        // Get Home page posts
        var user1 = {
            username : username,
        };
        axios.post('http://3.236.144.208:80/getPostsHomePage', user1).then((res) => {
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
        let interval
        // Refetch home page posts periodically (dynamic refresh)
        interval = setInterval(() => {
            axios.post('http://3.236.144.208:80/getPostsHomePage', user1).then((res) => {

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
            
            setPostList(postList);
        }).catch((error) => {
            console.log(error)
        });
    }, 7000);
	}, []);
	

    if (!auth) {
        return <Navigate to = "/login"/>;
    } else {
        return (
            <div classname="color1">
            <div classname="flexNeeded">
                <div classname="flexNeeded">
                    

                    <Header />
                    
                    <br></br>
                    <div className = "overcontainer2">
                        <h2>Home Page Posts</h2>
                    </div>
                    <div classname="padNeeded">
                        {allPosts}
                    </div>
                </div>
            </div>  
            </div>
        )
    }


}

export default Home;