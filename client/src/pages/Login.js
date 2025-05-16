import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response.data);
      alert(err.response.data.error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-secondary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;