import Card from 'react-bootstrap/Card';
import React, {
    useRef, useState, useEffect} from 'react';
import axios from 'axios';
import './UserInfo.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//             <UserInfo username={username} />

function UserInfo (props) {
    const username = props.username;
    const [userInterests, setUserInterests] = useState('');
    const [userAff, setUserAff] = useState('');
    const [userFirst, setUserFirst] = useState('');
    const [userLast, setUserLast] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userBday, setUserBday] = useState('');
    const [userPass, setUserPass] = useState('');
    const routeParams = useParams();
    

    const userRef = useRef();
    const errRef = useRef();

    useEffect(() => {
        //need to call getFriends when mounted - then refresh => check logic to make sure not infinitely making
        //a ton of backend calls
        let interval
        console.log(props.username);
        if(props.username !== '') {
          getInfo(props.username);
        } else {
          getInfo(routeParams.username);
        }
        interval = setInterval(() => {
          if(props.username !== '') {
            getInfo(props.username);
          } else {
            getInfo(routeParams.username);
          }
        }, 15000)
    
        return () => {
          // Clear the interval when component is unmounted
          clearInterval(interval)
        }
      }, []);
      //userEmail, userAff, userPass, userInterests

    const getInfo = async (username1) => {
        const response = await axios.post('http://3.236.144.208:80/getUser', {username : username1}).then((res) => {
            //console.log(res.data);
            let interestString = '';
            const len = res.data.categoryInterest.length;
            res.data.categoryInterest.forEach((interest, i) => {
              if (i < len-1) {
                interestString += interest + ", ";
              } else {
                interestString += interest;
              }
            })
            setUserInterests(interestString);
            console.log(res.data.categoryInterest);
            setUserAff(res.data.affiliation);
            setUserFirst(res.data.firstname);
            setUserLast(res.data.lastname);
            setUserEmail(res.data.email);
            setUserBday(res.data.birthday);
            setUserPass(res.data.password);
          
        }).catch((error) => {
          console.log(error)
        });
    }

  return (
    <Card className = "styleCard" style={{ width: '18rem'}}>
      <Card.Body>
        <Card.Title>Account Info</Card.Title>
        <Card.Text>
          First Name: {userFirst} 
        </Card.Text>
        <Card.Text>
          Last Name: {userLast} 
        </Card.Text>
        <Card.Text>
          Username: {username} 
        </Card.Text>
        <Card.Text>
          Email: {userEmail} 
        </Card.Text>
        <Card.Text>
          Birthday: {userBday} 
        </Card.Text>
        <Card.Text>
          Interests: {userInterests} 
        </Card.Text>
        <Card.Text>
          Affiliation: {userAff} 
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default UserInfo;