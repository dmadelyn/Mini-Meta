import React from 'react';
import Header from './header/Header';
import Friendfile from './Friendfile';
import './../App.css';
//placeholder - need to connect friend list to backend - profile pics are dummy placeholders for now
//placeholder - change "nick kuo" to friend associated with the profile
const profileimagelist = ['https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png'];
 
const friendprofilelist = ['https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png',
  'https://static.thenounproject.com/png/11204-200.png'];
 
function NewFriends() {
  const images = profileimagelist.map((image) => (
    <li key={image}>
      <Friendfile name="nick kuo" url={image} />
    </li>
  ));
  const images2 = friendprofilelist.map((image) => (
    <li key={image}>
      <Friendfile name="nick kuo" url={image} />
    </li>
  ));
  return (
    <>
      <Header />
      <div className="you_may_know">
        <h1 className="title inter-normal-black-24px">
          You may know:
        </h1>
      </div>
      <div className="wrapper">
        <ul>{images}</ul>
      </div>
      <div className="your friend">
        <h1 className="title inter-normal-black-24px">
          You friend:
        </h1>
      </div>
      <div className="wrapper2">
        <ul>{images2}</ul>
      </div>
    </>
  );
}
export default NewFriends;
 

