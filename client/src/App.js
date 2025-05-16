import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PersonalChatPage from './pages/PersonalChatPage';
import GroupChatPage from './pages/GroupChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personal" element={<PersonalChatPage />} />
        <Route path="/group" element={<GroupChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;