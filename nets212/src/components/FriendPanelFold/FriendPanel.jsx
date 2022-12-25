import React, {
  useRef, useState, useEffect} from 'react';
import './FriendPanel.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Card, Table } from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination';
import { useParams } from "react-router-dom";


function FriendPanel (props) {
  //const username = props.username;
  const navigate = useNavigate();
  const routeParams = useParams();

  const [currentFriends, setCurrentFriends] = useState([]);
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    //need to call getFriends when mounted - then refresh => check logic to make sure not infinitely making
    //a ton of backend calls
    let interval
    getFriends();

    interval = setInterval(() => {
      getFriends();
    }, 10000)

    return () => {
      // Clear the interval when component is unmounted
      clearInterval(interval)
    }
  }, [])

  // When friend is clicked, redirect to his/her page
  const handleRowClick = (e, val) => {
    e.preventDefault();
    navigate("/profile/" + val);
    window.location.reload();
  };
 
  // Refreshes dynamically friends
  const getFriends = async () => {
      setCurrentFriends([]);
      axios.post('http://3.236.144.208:80/getUserFriend', {username : routeParams.username}).then((res) => {
          //console.log(res.data);
          console.log(res.data);
          //console.log('current friends');
          //console.log('currentFriends);
          return res.data;
          }).then(async input => {
            const promiseArr = [];
            input.forEach((x,i) => {
              const prom = axios.post('http://3.236.144.208:80/getUser', {username : x.friend});
              promiseArr.push(prom);
            })
            const friends = [];
            Promise.all(promiseArr).then(function(values) {
              console.log(values);
              friends.push(values);
 
          const currRows = friends[0].map(function(item) {
 
            if (item.data.username !== routeParams.username) {
              return <tr key={item.data.username} className="friendRow" onClick={(e) => handleRowClick(e, item.data.username)}>
                  <td>{item.data.firstname + " " + item.data.lastname}</td>
                  <td>{item.data.username}</td>
                  <td><div className = "panel-friend-status"
                        style = {item.data.loggedIn === "Yes" ? {color: "green"}: {color: "red"}}>
                        ⬤</div>
                      </td>
              </tr>;
            }
          });
          setRows(currRows);
        });
         
      }).catch((error) => {
        console.log(error)
      });
      console.log('rows');
      console.log(rows);
  }
  return (
      <div className='cardPage'>
      <div className= 'styleFriendCard' >
      <Card>
    <Card.Body>
      <Card.Title><div className='friends-title'>FRIENDS</div></Card.Title>
      <Table className='friendTable'>
        <thead className= 'friendTableHead'>
          <tr style={{
   borderBottom: 'solid 3px blue',
   font:'Arial',
   background: 'cadetblue',
   color: 'white',
   fontWeight: 'bold',
 }}>
            <th> Name </th>
            <th>Username</th>
            <th>Logged In</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
  </div>
  </div>
  );
}

export default FriendPanel;

