import io from "socket.io-client";

let socket = io.connect("http://3.236.144.208:80");

export default socket;