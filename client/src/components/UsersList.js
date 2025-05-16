import React from 'react';

const UsersList = ({ users, onUserSelect }) => {
  return (
    <div className="mt-3">
      <h5>Users</h5>
      {users.map((user) => (
        <div 
          key={user._id} 
          className="p-2 my-1 border bg-light" 
          style={{ cursor: 'pointer' }}
          onClick={() => onUserSelect(user)}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default UsersList;