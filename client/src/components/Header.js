import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-primary text-white p-3">
      <div className="container d-flex justify-content-between">
        <h3 style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Chat App</h3>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;