import React, {
  useRef, useState, useEffect} from 'react';
import axios from 'axios';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

 
function Login() {
  const [, loginStatus] = useState(false);
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [pass, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');


  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setErrMsg('');
  }, [username, pass]);

  // When user presses login, attemps to login user and makes user retry if login is invalid
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      var user = {
        username : username,
        password : pass,
      };
      axios.post('http://3.236.144.208:80/loginUser', user).then((res) => {
        console.log(res.data);
        if(res.data.username) {
          localStorage.setItem("authenticated", true);
          localStorage.setItem("user", username);
          navigate('/home');
        } else {
          alert("Incorrect username or password");
        }
      }).catch((error) => {
        console.log(error)
      });

      loginStatus(true);

      

    } catch (err) {
      console.log("ERROR CAUGHT");
      if (!err?.response) {
        setErrMsg('There is an error with the server');
      } else if (err.response?.status === 400) {
        setErrMsg('Please check that you have filled in all fields');
      } else {
        setErrMsg('Please try again.');
      }
      errRef.current.focus();
    }
  };

 
  return (
    <div className="container2">
        <div className="login2" id="l1">
          <div className="mainDiv">
            <h1>Welcome to Mini Meta!</h1>
            <h3 className="mainDiv2">A place to chat, relax, and find yourself</h3>
          </div>
          <div className="mainDiv">
              <form className = "logForm" onSubmit = {handleLogin}>
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
                    value={pass}
                    required
                  />
                
                <button type="submit" className="loginbutton">Login</button>
              </form>
              <div className = "error-msg" ref = {errRef}>{errMsg}</div>
            <br></br>
            <Link to="/register">
            <button className="loginBut2">
                Create New Account!
            </button>
            </Link>
          </div>
          </div>
      </div>
  );
}
export default Login;

