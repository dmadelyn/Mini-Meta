import { useEffect, useState } from 'react'
import './ChatListItem.css'

function ChatListItem({chatroom, openChatroom, currChatID, index}) {

    let [selected, setSelected] = useState(false);

    useEffect(() => {
        setSelected(chatroom.chatID === currChatID);
    }, [currChatID])

    return (
        <div className = "chat-thumbnail-container" style = 
            {selected ? {backgroundColor: "rgba(0, 0, 0, 0.04)"}: 
                {backgroundColor: "white"}}
            onClick = {() => openChatroom(currChatID, chatroom.chatID, index)}>
            <div className = "chat-thumbnail-name">
                {chatroom.members.join(", ")}
            </div>
            <div className = "chat-thumbnail-message">
                {chatroom.messages.length > 0 ? (chatroom.messages[chatroom.messages.length - 1].content) : 'Send your first message!'}
            </div>
        </div>
    )
}

export default ChatListItem
