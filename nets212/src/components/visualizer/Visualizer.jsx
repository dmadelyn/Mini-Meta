import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router-dom";
import Header from "../header/Header"
import { Navigate } from 'react-router-dom';
import Graph from "react-graph-vis";
import ReactDOM from "react-dom";

function Visualize() {
  const [auth, setAuth] = useState(localStorage.getItem("authenticated"));
  const [nodeList, setNodeList] = useState([]);
  const [edgeList, setEdgeList] = useState([]);
  const [affiliation, setAffiliation] = useState("");

  const options = {
    layout: {
      hierarchical: false
    },
    edges: {
      color: "#000000"
    }
  };

  // Initialize graph node just to currently logged in user
  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: [
        { id: localStorage.getItem("user"), label: localStorage.getItem("user"), color: "#BF40BF"},
      ],
      edges: []
    },
    events: {
      select: ({ nodes, edges }) => {
        alert("Selected node: " + nodes);
        //createNode(nodes);
      },
      doubleClick: ({ pointer: { canvas } }) => {
        //createNode(canvas.x, canvas.y);
      }
    }
  })
  const { graph, events } = state;

  // Add all friends of clicked node to graph (who have same affiliation as logged in user)
  const createNode = (currUser, edgeList1, nodeList1) => {
    setState({
        graph: {
          nodes: JSON.parse(localStorage.getItem('nodeList')),
          edges: JSON.parse(localStorage.getItem('edgeList')),
        },
      
    })


    var color = "#0096FF";
    console.log("currUser: "+ currUser);
    axios.post('http://3.236.144.208:80/getUserFriend', {username : ""+currUser}).then((res) => {
          console.log(res.data);
          return res.data;
          }).then(async input => {
            const promiseArr = [];
            input.forEach((x,i) => {
              const prom = axios.post('http://3.236.144.208:80/getUser', {username : x.friend});
              promiseArr.push(prom);
            })
            const friends = [];
            Promise.all(promiseArr).then(function(values) {
              // list of JSONs
              console.log("check: ");
              console.log(values);
              friends.push(values);

              console.log("check2: ");
              console.log(edgeList1);

              var out = nodeList1;
              var edgeL = edgeList1;
              

              const currRows = friends[0].map(function(item) {
                
                if (item.data.username !== ""+currUser) {
                  console.log("This is: ");
                  console.log(item.data.username);
                    if (item.data.affiliation === localStorage.getItem("affil")) {
                        //create node for user 
                        console.log("yo this is: " + item.data.affiliation  + "who is "+ item.data.username);
                        out.push({id:item.data.username, label:item.data.username, color: color});
                        edgeL.push({from: ""+currUser, to: item.data.username});
                    }
                }
              });
              console.log("HFIEOHUES: ");
              console.log(out);
              console.log("EDGES: ");
              console.log(edgeL);
              localStorage.setItem("edgeList", JSON.stringify(edgeL));
              localStorage.setItem("nodeList", JSON.stringify(out));



              setState({
                  graph: {
                    nodes: JSON.parse(localStorage.getItem('nodeList')),
                    edges: JSON.parse(localStorage.getItem('edgeList')),
                  },
                  events: {
                    select: ({ nodes, edges }) => {
                      console.log("Heyyyy!");
                      createNode(nodes, edgeL, out);
                    }
                  }
                
                });
              
        });
         
      }).catch((error) => {
        console.log(error)
      });
  }

  // Gets immediate friends of user and displays on visualizer (connected to logged in user node)
  useEffect(() => {
    var color = "#BF40BF";
    axios.post('http://3.236.144.208:80/getUserFriend', {username : localStorage.getItem("user")}).then((res) => {
      var nodeList = [];

      res.data.forEach(val => {

        var currJson = {
          id: val.friend,
          label: val.friend,
          color: color
        };
        nodeList.push(currJson);
      });

      setNodeList(nodeList);

      // set edges
      var edgeList = [];
      var c = 1
      res.data.forEach(val => {
        if(val.friend !== localStorage.getItem("user")) {
          edgeList.push({from: localStorage.getItem("user"), to: val.friend, id: c});
          c = c+1;
        }
      });
      setEdgeList(edgeList);

      
      
      localStorage.setItem("edgeList", JSON.stringify(edgeList));
      localStorage.setItem("nodeList", JSON.stringify(nodeList));

      console.log("edgeList");
      console.log(edgeList);
      console.log("nodeList");
      console.log(nodeList);
      // setState
      setState(() => {
        return {
          graph: {
            nodes: JSON.parse(localStorage.getItem('nodeList')),
            edges: JSON.parse(localStorage.getItem('edgeList')),
          },
          events: {
            select: ({ nodes, edges }) => {
              console.log("HIIII");
              createNode(nodes, edgeList, nodeList);
            }
          }
        }
      });

       
    }).catch((error) => {
        console.log(error);
    });
    axios.post('http://3.236.144.208:80/getUser', {username : localStorage.getItem("user")}).then((res) => {
          setAffiliation(res.data.affiliation);
          localStorage.setItem("affil", res.data.affiliation);
          console.log("HEY THE AFFIL IS: " + affiliation);
        }).catch ((error) => {
            console.log(error);
      });
    
  }, []);

  function randomColor() {
    const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${red}${green}${blue}`;
  }

  
  
   
  
  
  if (!auth) {
    return <Navigate to = "/login"/>;
  } else {
  return (
    <div>
      <Header />
      <h1>Mini Meta Friend Visualizer</h1>
      
      <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
    </div>
  );
  }
}

export default Visualize;