import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const GroupChatPage = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [joinGroupId, setJoinGroupId] = useState('');
  const [createGroupName, setCreateGroupName] = useState('');
  const [notifications, setNotifications] = useState({});
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const groupChats = res.data.filter((chat) => chat.isGroupChat);
        setChats(groupChats);
        if (groupChats.length > 0) {
          setCurrentChat(groupChats[0]);
          setNotifications((prev) => {
            const newNotifs = { ...prev };
            delete newNotifs[groupChats[0]._id];
            return newNotifs;
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (currentChat) {
      socket.emit('joinChat', currentChat._id);
      setNotifications((prev) => {
        const newNotifs = { ...prev };
        delete newNotifs[currentChat._id];
        return newNotifs;
      });
    }
  }, [currentChat]);

  useEffect(() => {
    socket.on('message', (message) => {
      if (message.chatId) {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat._id === message.chatId) {
              return { ...chat, latestMessage: message };
            }
            return chat;
          })
        );
        if (!currentChat || message.chatId !== currentChat._id) {
          setNotifications((prev) => ({ ...prev, [message.chatId]: true }));
        }
      }
    });
    return () => socket.off('message');
  }, [socket, currentChat]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat/group',
        { name: createGroupName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats((prev) => [res.data, ...prev]);
      setCreateGroupName('');
      setCurrentChat(res.data);
      setNotifications((prev) => {
        const newNotifs = { ...prev };
        delete newNotifs[res.data._id];
        return newNotifs;
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Error creating group chat');
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/chat/group/join',
        { groupId: joinGroupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats((prev) => [res.data, ...prev]);
      setJoinGroupId('');
      setCurrentChat(res.data);
      setNotifications((prev) => {
        const newNotifs = { ...prev };
        delete newNotifs[res.data._id];
        return newNotifs;
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Error joining group chat');
    }
  };

  return (
    <div>
      <Header />
      <div className="container-fluid" style={{ backgroundColor: '#fbc02d', height: '100vh', overflow: 'hidden' }}>
        <button className="btn btn-link my-2" onClick={() => navigate('/dashboard')}>
          &larr; Back to Dashboard
        </button>
        <div className="row" style={{ height: 'calc(100vh - 70px)' }}>
          <div className="col-md-3 border-end pt-3" style={{ overflowY: 'auto' }}>
            <h5>Group Chats</h5>
            <form onSubmit={handleCreateGroup} className="mb-4">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="New Group Name"
                  value={createGroupName}
                  onChange={(e) => setCreateGroupName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Create Group
              </button>
            </form>
            <form onSubmit={handleJoinGroup} className="mb-4">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Enter Group Chat ID"
                  value={joinGroupId}
                  onChange={(e) => setJoinGroupId(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Join Group
              </button>
            </form>
            {chats.length === 0 ? (
              <p className="text-muted">No group chats yet</p>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat._id}
                  className="p-2 my-1 border bg-light d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCurrentChat(chat)}
                >
                  <div>
                    <strong>{chat.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#555' }}>
                      {chat.latestMessage ? chat.latestMessage.content : 'No messages yet'}
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
              ))
            )}
          </div>
          <div className="col-md-9 pt-3">
            {currentChat ? (
              <ChatBox socket={socket} chat={currentChat} user={user} allUsers={allUsers} />
            ) : (
              <div className="text-center mt-5">
                <h4>Select a group to start messaging</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;