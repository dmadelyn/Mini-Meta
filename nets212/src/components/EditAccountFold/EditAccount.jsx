import React, {
  useRef, useState, useEffect} from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import './EditAccount.css';
import Header from '../header/Header.jsx';
import UserInfo from '../UserInfoFold/UserInfo';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { Navigate } from 'react-router-dom';


//get the current user from cookies - check if this page should be rendered or not if user not signed in
// add functionality to require at least two interests from the user 
function EditAccount() {
  const [auth, setAuth] = useState(localStorage.getItem("authenticated"));
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  //const [username, setUsername] = useState('');
  const username = localStorage.getItem("user");
  //const username = 'nickkuo'; //hardcoded for testing purposes 
  const [pass, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  //new vars for input fields
  const [newAff, setNewAff] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newInterests, setNewInterests] = useState('');

  // Preset category interests
  const options = [
    { value: 'LATINO VOICES', label: 'LATINO VOICES' },
    { value: 'MONEY', label: 'MONEY' },
    { value: 'WORLDPOST', label: 'WORLDPOST' },
    { value: 'STYLE & BEAUTY', label: 'STYLE & BEAUTY' },
    { value: 'CRIME', label: 'CRIME' },
    { value: 'ENVIRONMENT', label: 'ENVIRONMENT' },
    { value: 'COMEDY', label: 'COMEDY' },
    { value: 'TASTE', label: 'TASTE' },
    { value: 'BUSINESS', label: 'BUSINESS' },
    { value: 'EDUCATION', label: 'EDUCATION' },
    { value: 'SPORTS', label: 'SPORTS' },
    { value: 'FIFTY', label: 'FIFTY' },
    { value: 'QUEER VOICES', label: 'QUEER VOICES' },
    { value: 'COLLEGE', label: 'COLLEGE' },
    { value: 'MEDIA', label: 'MEDIA' },
    { value: 'SCIENCE', label: 'SCIENCE' },
    { value: 'HEALTHY LIVING', label: 'HEALTHY LIVING' },
    { value: 'THE WORLDPOST', label: 'THE WORLDPOST' },
    { value: 'BLACK VOICES', label: 'BLACK VOICES' },
    { value: 'WEDDINGS', label: 'WEDDINGS' },
    { value: 'GOOD NEWS', label: 'GOOD NEWS' },
    { value: 'ENTERTAINMENT', label: 'ENTERTAINMENT' },
    { value: 'TRAVEL', label: 'TRAVEL' },
    { value: 'HOME & LIVING', label: 'HOME & LIVING' },
    { value: 'PARENTING', label: 'PARENTING' },
    { value: 'POLITICS', label: 'POLITICS' },
    { value: 'PARENTS', label: 'PARENTS' },
    { value: 'STYLE', label: 'STYLE' },
    { value: 'CULTURE & ARTS', label: 'CULTURE & ARTS' },
    { value: 'WEIRD NEWS', label: 'WEIRD NEWS' },
    { value: 'DIVORCE', label: 'DIVORCE' },
    { value: 'GREEN', label: 'GREEN' },
    { value: 'ARTS', label: 'ARTS' },
    { value: 'WOMEN', label: 'WOMEN' },
    { value: 'TECH', label: 'TECH' },
    { value: 'IMPACT', label: 'IMPACT' },
    { value: 'FOOD & DRINK', label: 'FOOD & DRINK' },
    { value: 'RELIGION', label: 'RELIGION' },
    { value: 'ARTS & CULTURE', label: 'ARTS & CULTURE' },
    { value: 'WELLNESS', label: 'WELLNESS' },
    { value: 'WORLD NEWS', label: 'WORLD NEWS' },
  ]
  
  useEffect(() => {
    setErrMsg('');
  }, [newEmail, newPassword, newInterests, newAff]);

  // Update email and post that email is updated
  const updateEmail = async (e) => {
    e.preventDefault();
    try {
      console.log(newEmail);
      const response = await axios.post('http://3.236.144.208:80/updateEmail', {email: newEmail, username: username});
      setNewEmail('');
    } catch (err) {
      console.error(err);
    }
    navigate('/editprofile');
  };
  
  // Update affiliation and post that affiliation is updated
  const updateAffiliation = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      console.log(newAff);
      const response = await axios.post('http://3.236.144.208:80/updateAffiliation', {username: username, affiliation: newAff});
    } catch (err) {
      console.error(err);
    }
    try{
      //post request needs author, recipient, content
      const status = username + ' is now affiliated with ' + newAff;
      const response2 = await axios.post('http://3.236.144.208:80/addPost', {author: username, recipient: username, content: status});
    } catch (err) {
      console.error(err);
    }
    setNewAff('');
    navigate('/editprofile');
  };

  // Update password
  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      console.log(newPassword);
        const response = await axios.post('http://3.236.144.208:80/updatePassword', {password :newPassword, username : username});
      setNewPassword('');
    } catch (err) {
      console.error(err);
    }
    navigate('/editprofile');
  };

  // Update interests and post
  const updateInterests = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      if(newInterests.split(",").length <= 1) {
        alert("Need more than 2 interests!");
      } else {
      console.log(newInterests);
      const response = await axios.post('http://3.236.144.208:80/updateCategories', {username : username, categoryInterest: newInterests});
      }
    } catch (err) {
      console.error(err);
    
    }

    try{
      //post request needs author, recipient, content
      const status = username + ' is now interested in ' + newInterests;
      const response2 = await axios.post('http://3.236.144.208:80/addPost', {author: username, recipient: username, content: status});
    } catch (err) {
      console.error(err);
    }
    setNewInterests('');
    navigate('/editprofile');
  };
 
  if (!auth) {
    return <Navigate to = "/login"/>;
  } else {
  return (
    <div className = "page2-editacc">
          <Header />
    <div className="Accountcontainer-editacc">
          <div className="account-banner">
            <div className = "account-header">
              <h1>Account Details</h1>
              <h3 className="account2-editacc">Make changes to your account details</h3>
            </div>
          </div>

          <div className = "user-container">
            <div className="user-info-container">
              <div className="style-card-container">
                <UserInfo username={username}/> 
              </div>
            </div>


            <div className="user-edit-container">
              <div className = "user-edit-wrapper">
              <div className="accountDiv3-editacc">
                <form className = "accForm" onSubmit = {updateEmail}>
                    Email
                    <input
                      className="inputAcc"
                      id="Email-input-acc"
                      ref={userRef}
                      type="text"
                      placeholder="Enter New Email Here"
                      onChange={(e) => setNewEmail(e.target.value)}
                      value={newEmail}
                      required
                    />
                    <button type="submit" className="changebutton">Update Email</button>
                </form>
                <form className = "accForm" onSubmit = {updateAffiliation}>
                    Affiliations
                    <input
                      className="inputAcc"
                      id="Affiliation-input-acc"
                      type="text"
                      placeholder="Enter New Affiliations Here"
                      onChange={(e) => {
                        setNewAff(e.target.value);
                      }}
                      value={newAff}
                      required
                    />
                  
                  <button type="submit" className="changebutton">Update Affiliations</button>
                </form>
              </div>
              <div className="info-1-editacc">
                <div className="accountDiv3-editacc">
                  <form className = "accForm" onSubmit = {updatePassword}>
                      Password
                      <input
                        className="inputAcc"
                        id="password-input-acc"
                        type="password"
                        placeholder="Enter New Password Here"
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                        }}
                              value={newPassword}
                              required
                            />
                      
                      <button type="submit" className="changebutton">Update Password</button>
                    </form>
                    <form className = "accForm" onSubmit = {updateInterests}>
                      Interests (Choose at least 2)
                        <Select 
                        options={options}
                        isMulti
                        name="colors-acc"
                        onChange={(e) => {
                          console.log(e);
                          var out = "";
                          e.forEach(val => {
                            out += ("," + val.value);
                          });
                          out = out.substring(1);
                          console.log(out);
                          setNewInterests(out);
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        />
                      <button type="submit" className="changebutton">Update Interests</button>
                    </form>
                    <div className = "error-msg" ref = {errRef}>{errMsg}</div>
                  </div>
                  <br></br>
                  <Link to="/home">
                  <button className="homeButton">
                      Here by mistake? Click to return home!
                  </button>
                  </Link>
                </div>
              </div>



              
          </div>
          </div>
          
          
          
          </div>
      </div>
  );
  }
}
export default EditAccount;

