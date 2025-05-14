import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import UserList from './components/UserList';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (!isAuth) {
    return (
      <>
        <h1>Register</h1>
        <Register onSuccess={() => setIsAuth(true)} />
        <h1>Login</h1>
        <Login onSuccess={() => setIsAuth(true)} />
      </>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <UserList onSelect={setSelectedRoom} />
      {selectedRoom && <Chat room={selectedRoom} />}
    </div>
  );
}

export default App;
