import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h1 className="text-center">Realtime Chat Application</h1>
        <div className="row justify-content-center mt-4">
          <div className="col-md-5 text-center">
            <button onClick={() => navigate('/personal')} className="btn btn-primary w-100 mb-3">
              Personal Chat
            </button>
            <button onClick={() => navigate('/group')} className="btn btn-success w-100">
              Group Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;