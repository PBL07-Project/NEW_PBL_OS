import React, { useState } from 'react';
import axios from 'axios';

const CreateChat = ({ token, setAllChats, userId }) => {
  const [chatType, setChatType] = useState('personal'); 
  const [chatName, setChatName] = useState('');
  const [participantId, setParticipantId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (chatType === 'group') {
        
        res = await axios.post(
          'http://localhost:5000/api/chat/group',
          { name: chatName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
      
        res = await axios.post(
          'http://localhost:5000/api/chat/personal',
          { userId: participantId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setAllChats(prev => [res.data, ...prev]);
      setChatName('');
      setParticipantId('');
    } catch (error) {
      console.error('Error creating chat:', error.response?.data);
      alert('Error creating chat');
    }
  };

  return (
    <div className="mb-3">
      <h5>Create Chat</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              type="radio" 
              value="personal" 
              checked={chatType === 'personal'} 
              onChange={() => setChatType('personal')}
              id="personalRadio" 
            />
            <label className="form-check-label" htmlFor="personalRadio">Personal</label>
          </div>
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              type="radio" 
              value="group" 
              checked={chatType === 'group'} 
              onChange={() => setChatType('group')}
              id="groupRadio" 
            />
            <label className="form-check-label" htmlFor="groupRadio">Group</label>
          </div>
        </div>
        {chatType === 'group' ? (
          <div className="mb-2">
            <input 
              placeholder="Group Chat Name" 
              className="form-control" 
              value={chatName} 
              onChange={(e) => setChatName(e.target.value)} 
              required 
            />
          </div>
        ) : (
          <div className="mb-2">
            <input 
              placeholder="Participant User ID" 
              className="form-control" 
              value={participantId} 
              onChange={(e) => setParticipantId(e.target.value)} 
              required 
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100">Create Chat</button>
      </form>
    </div>
  );
};

export default CreateChat;