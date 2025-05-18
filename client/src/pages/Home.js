import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to DEEPCHAT : A realtime messaging App Powered by OS - Level Fundamentals</h1>
      <p className="lead">Connect with friends and colleagues instantly</p>
      <div className="d-flex justify-content-center my-4">
        <button 
          className="btn btn-primary mx-2" 
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button 
          className="btn btn-success mx-2" 
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;