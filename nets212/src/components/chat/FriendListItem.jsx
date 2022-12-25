import axios from 'axios';
import './FriendListItem.css';

function FriendListItem({friend, last, chatrooms, setChatrooms}) {
    
    const invite = () => {
        if (localStorage.getItem("user") !== null) {
            var chatList = []
            chatList.push(friend.user);
            chatList.push(localStorage.getItem("user"));
            chatList.sort();
    
            var chatID = chatList.join("");
            var params = {
                username : friend.user,
                chatID : chatID,
                members : [localStorage.getItem("user")]
            }
            console.log(params);
            axios.post('http://3.236.144.208:80/inviteToChat', params).then (async response => {
                var params = {
                    username : localStorage.getItem("user"),
                    chatID : chatID,
                    members : [friend.user]
                }
                axios.post('http://3.236.144.208:80/addToChat', params).then(async response => {
                    console.log(response.data);
                    if (response.data.message === "Success") {
                        let response = await fetch(`http://3.236.144.208:80/getMessages?room=${encodeURIComponent(chatID)}`);
                        let data = await response.json();
                        var cr = {
                            chatID: chatID,
                            members: [friend.user],
                            messages: data
                        }
                        chatrooms.push(cr);
                        setChatrooms(chatrooms.map(x => x));
                    }
                })
            })

            
        }
    }

    return (
        <div className = "chat-friend-container" 
            style = {last ? {borderBottom: "1px solid silver"} : {}}>
            <div className = "chat-friend-label-container">
                <div className = "chat-friend-label-status">
                    <div className = "chat-friend-label">
                        {friend.user}
                    </div>
                    <div className = "chat-friend-status"
                        style = {friend.online === "Yes" ? {color: "green"}: {color: "red"}}>
                        ⬤
                    </div>
                    
                </div>
            </div>
            <div className = "invite-button-container">
                {friend.online === "Yes" ? 
                (<button type = "button" 
                    className = "chat-invite-button btn btn-primary" onClick = {() => invite()}>
                    Invite to Chat
                </button>) : ""
                }
            </div>
            
        </div>
    )
}

export default FriendListItem;