import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './components/LoginFold/Login';
import Signup from './components/SignUpFold/Signup';
import Profile from './components/ProfilePage';
import NewFriends from './components/Newfriend';
import EditProfile from './components/EditAccountFold/EditAccount';
import Chat from './components/chat/Chat';
import {Routes, Route} from 'react-router-dom';
import Home from './components/HomeFold/Home';
import NewsFeed from './components/NewsFeedFold/NewsFeed';
import Visualizer from './components/visualizer/Visualizer';
 
function App() {
  return (
  <Routes>
 
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route
        exact
        path="/profile"
        element = {<Profile />}/>
      <Route
        exact
        path="/profile/:username"
        element={<Profile />} />
      <Route path= "/newfriend" element={<NewFriends />} />
      <Route path= "/editprofile" element={<EditProfile />} />
     <Route path = "/home" element = {<Home/>}/>
     <Route path = "/chat" element = {<Chat/>}/> 
     <Route path = "/newsfeed" element = {<NewsFeed />} />
     <Route path = '/visualizer' element = {<Visualizer />}/>
      </Routes>
  );
}
 
export default App;
 

