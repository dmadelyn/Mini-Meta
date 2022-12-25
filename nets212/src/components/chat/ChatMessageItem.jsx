import './ChatMessageItem.css'

function ChatMessageItem({message}) {

    return (
        <div className = "chat-message-container">
            <div className = { message.author === localStorage.getItem("user") ? 
                "chat-message-self" : "chat-message-other"}>
                <div className = "chat-message">
                    {message.content}
                </div>
                <div className = "chat-message-author">
                {message.author}
                </div>
            </div>
        </div>
    )
}

export default ChatMessageItem