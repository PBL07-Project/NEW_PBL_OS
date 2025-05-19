import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';
import UsersList from '../components/UsersList';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
const PersonalChatPage = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const personalChats = res.data.filter(chat => !chat.isGroupChat);
        setChats(personalChats);
        if (personalChats.length > 0) {
          setCurrentChat(personalChats[0]);
          setNotifications(prev => {
            const newNotifs = { ...prev };
            delete newNotifs[personalChats[0]._id];
            return newNotifs;
          });
        }
      } catch (err) {
        console.error("Error fetching chats", err);
      }
    };
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchChats();
    fetchUsers();
  }, [token]);

  const getOtherUser = (chat) => {
    if (!chat.users) return {};
    return chat.users.find(u => u._id !== user.id) || {};
  };

  useEffect(() => {
    if (currentChat && currentChat._id) {
      socket.emit('joinChat', currentChat._id);
      setNotifications(prev => {
        const newNotifs = { ...prev };
        delete newNotifs[currentChat._id];
        return newNotifs;
      });
    }
  }, [currentChat]);


  useEffect(() => {
    const handleMessage = (message) => {
      if (message.chatId) {
        setChats(prevChats =>
          prevChats.map(chat => {
            if (chat._id === message.chatId) {
              return { ...chat, latestMessage: message };
            }
            return chat;
          })
        );
        if (!currentChat || message.chatId !== currentChat._id) {
          setNotifications(prev => ({ ...prev, [message.chatId]: true }));
        }
      }
    };

    socket.on('message', handleMessage);
    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket, currentChat]);
  const handleUserSelect = async (selectedUser) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat/personal',
        { userId: selectedUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats(prevChats => {
        const exists = prevChats.find(chat => chat._id === res.data._id);
        if (!exists) return [res.data, ...prevChats];
        return prevChats;
      });
      setCurrentChat(res.data);
      setNotifications(prev => {
        const newNotifs = { ...prev };
        delete newNotifs[res.data._id];
        return newNotifs;
      });
    } catch (err) {
      console.error("Error starting chat", err);
      alert(err.response?.data?.error || 'Error starting personal chat');
    }
  };

  return (
    <div>
      <Header />
      <div className="container-fluid" style={{ backgroundColor: 'white', height: '100vh', overflow: 'hidden' }}>
        <button className="btn btn-link my-2" onClick={() => navigate('/dashboard')}>
          &larr; Back to Dashboard
        </button>
        <div className="row" style={{ height: 'calc(100vh - 70px)' }}>
          <div className="col-md-3 border-end pt-3" style={{ overflowY: 'auto' }}>
            <h5>Recent Personal Chats</h5>
            {chats.length === 0 ? (
              <p className="text-muted">No recent chats</p>
            ) : (
              chats.map(chat => {
                const otherUser = getOtherUser(chat);
                return (
                  <div 
                    key={chat._id}
                    className="p-2 my-1 border bg-light d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCurrentChat(chat)}
                  >
                    <div>
                      <strong>{otherUser.username || "User"}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#555' }}>
                        {chat.latestMessage ? chat.latestMessage.content : "No messages yet"}
                      </div>
                    </div>
                    {notifications[chat._id] && (
                      <span style={{
                        backgroundColor: 'red',
                        borderRadius: '50%',
                        width: '10px',
                        height: '10px',
                        display: 'inline-block'
                      }}></span>
                    )}
                  </div>
                );
              })
            )}
            <UsersList users={users} onUserSelect={handleUserSelect} />
          </div>
          <div className="col-md-9 pt-3">
            {currentChat ? (
              <ChatBox socket={socket} chat={currentChat} user={user} allUsers={users} />
            ) : (
              <div className="text-center mt-5">
                <h4>Select a user or chat to start messaging</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalChatPage;