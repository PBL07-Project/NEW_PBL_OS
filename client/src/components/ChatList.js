import React from 'react';
const ChatList = ({ groupChats, personalChats, setCurrentChat, currentChat }) => {
  return (
    <div>
      <h5>Group Chats</h5>
      {groupChats.length === 0 ? (
        <p className="text-muted">No group chats available.</p>
      ) : (
        groupChats.map((chat) => (
          <div 
            key={chat._id} 
            onClick={() => setCurrentChat(chat)} 
            className={`p-2 my-1 border ${currentChat && currentChat._id === chat._id ? 'bg-secondary text-white' : 'bg-light'}`} 
            style={{ cursor: 'pointer' }}
          >
            {chat.name} <br />
            <small>Group ID: {chat._id}</small>
          </div>
        ))
      )}
      <h5 className="mt-3">Personal Chats</h5>
      {personalChats.length === 0 ? (
        <p className="text-muted">No personal chats available.</p>
      ) : (
        personalChats.map((chat) => {
          const otherUser = chat.users.find(u => u._id !== currentChat?.users[0]) || { username: 'User' };
          return (
            <div 
              key={chat._id} 
              onClick={() => setCurrentChat(chat)} 
              className={`p-2 my-1 border ${currentChat && currentChat._id === chat._id ? 'bg-secondary text-white' : 'bg-light'}`} 
              style={{ cursor: 'pointer' }}
            >
              Personal Chat with {otherUser.username}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;