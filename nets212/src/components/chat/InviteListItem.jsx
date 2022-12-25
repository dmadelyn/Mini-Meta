import axios from 'axios';
import './InviteListItem.css';

function InviteListItem({invite, invites, setInvites, chatrooms, setChatrooms}) {

    const joinChat = async () => {
        if (chatrooms.filter(x => x.chatID === invite.chatID).length === 0) {
            // chatrooms.push(invite);
            // if (localStorage.getItem("chatrooms") === null) {
            //     localStorage.setItem("chatrooms", JSON.stringify([invite]));
            // } else {
            //     var rooms = JSON.parse(localStorage.getItem("chatrooms"));
            //     rooms.push(invite);
            //     localStorage.setItem("chatrooms", JSON.stringify(rooms));
            // }

            var params = {
                username : localStorage.getItem("user"),
                chatID: invite.chatID,
                members : invite.inviters,
            }
            
            console.log("PARAMS");
            console.log(params);
            axios.post('http://3.236.144.208:80/addToChat', params).then(async response => {
                console.log(response.data);
                if (response.data.message === "Success") {
                    let response = await fetch(`http://3.236.144.208:80/getMessages?room=${encodeURIComponent(invite.chatID)}`);
                    let data = await response.json();
                    var cr = {
                        chatID: invite.chatID,
                        members: invite.inviters,
                        messages: data
                    }
                    chatrooms.push(cr);
                    setChatrooms(chatrooms.map(x => x));
                    deleteInvite();
                }
            })
        } else {
            deleteInvite();
        }
    }

    const deleteInvite = () => {
        setInvites(invites.filter(x => x !== invite))
        var params = {
            username: localStorage.getItem("user"),
            chatID: invite.chatID,
        }
        axios.post('http://3.236.144.208:80/deleteChatInvite', params);
    }

    return (
        <div className = "chat-invite-container">
            <div className = "chat-invite-info-container">
                {invite.inviters.join(", ")}
            </div>
            <div className = 'chat-invite-buttons-container'>
                <button type = "button" onClick = {() => joinChat()}
                    className = "chat-accept-button btn btn-success">
                    Accept
                </button>
                <button type = "button" onClick = {() => deleteInvite()}
                    className = "chat-decline-button btn btn-danger">
                    Decline
                </button>
            </div>
            
        </div>
    )
}

export default InviteListItem