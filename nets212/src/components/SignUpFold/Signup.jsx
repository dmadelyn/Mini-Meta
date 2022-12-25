import './Signup.css';
import axios from 'axios';
import React, {
  useRef, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select'
 
function AddingNewUser() {

  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [birthday, setBirthday] = useState('');
  const [interests, setInterests] = useState('');

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const navigate = useNavigate();

  // Checks input is valid, and then registers username is not already taken
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // look at HANDLELOGIN from Login.jsx
      var newUser = {
        username : username,
        password : password,
        firstName : firstName,
        lastName : lastName,
        email : email,
        affiliation : affiliation,
        birthday : birthday,
        interests : interests
      }
      console.log(newUser);
      if(newUser.interests.split(",").length <= 1) {
        alert("Need more than 2 interests!");
      } else if(birthday.split("/").length !== 3) {
        alert("Invalid birthday listed. Must be mm/dd/yyyy format");
      } else {
        axios.post('http://3.236.144.208:80/registerUser', newUser).then(val => {
          console.log("New User" + val.data.username);

          if(val.data.username === null) {
            alert("Username already in use.")
          } else {
            localStorage.setItem("authenticated", true);
            localStorage.setItem("user", newUser.username);
            navigate('/home');
          }
        }).catch(err => {
          console.log(err);
        })
      }

    } catch (err) {
      console.error(err);
    }

  };
  

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
  
  return (
    <div className="container2">
        <div className="login2" id="l1">
          <div className="mainDiv">
            <h1>Register for a new account!</h1>
            <h3 className="mainDiv2">Let us get to know you a bit!</h3>
            <br></br>
            <Link to="/">
            <button className="loginBut3">
                Go back to login page
            </button>
            </Link>
          </div>
          <div className="mainDiv">
              <form className = "logForm1" onSubmit = {handleCreateUser}>
                  USERNAME
                  <input
                    className="input1"
                    id="Username-input"
                    ref={userRef}
                    type="text"
                    placeholder="Enter Username Here"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    required
                  />
                
                  PASSWORD
                  <input
                    className="input1"
                    id="password-input"
                    type="password"
                    placeholder="Enter Password Here"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                    required
                  />

                  FIRST NAME
                  <input
                    className="input1"
                    type="text"
                    placeholder="Enter First Name"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    value={firstName}
                    required
                  />

                  LAST NAME
                  <input
                    className="input1"
                    type="text"
                    placeholder="Enter Last Name"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                    value={lastName}
                    required
                  />

                  EMAIL
                  <input
                    className="input1"
                    type="text"
                    placeholder="Enter Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                    required
                  />

                  Interests (Choose at least 2)
                  <Select 
                  options={options}
                  isMulti
                  name="colors"
                  onChange={(e) => {
                    console.log(e);
                    var out = ""
                    e.forEach(val => {
                      out += ("," + val.value);
                    });
                    out = out.substring(1);
                    setInterests(out);
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  />

                  AFFILIATION
                  <input
                    className="input1"
                    type="text"
                    placeholder="Ex: UPenn"
                    onChange={(e) => {
                      setAffiliation(e.target.value);
                    }}
                    value={affiliation}
                    required
                  />

                  Birthday
                  <input
                    className="input1"
                    type="text"
                    placeholder="mm/dd/yyyy"
                    onChange={(e) => {
                      setBirthday(e.target.value);
                    }}
                    value={birthday}
                    required
                  />

                  
                <br></br>
                <button type="submit" className="loginbutton">Create Account</button>
              </form>
              <div className = "error-msg" ref = {errRef}>{errMsg}</div>

          </div>
          </div>
      </div>
  );
}
 
export default AddingNewUser;

