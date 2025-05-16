import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input 
            name="username" 
            className="form-control" 
            placeholder="Username"
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            name="email" 
            type="email" 
            className="form-control" 
            placeholder="Email"
            onChange={handleChange}
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            name="password" 
            type="password" 
            className="form-control" 
            placeholder="Password"
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;