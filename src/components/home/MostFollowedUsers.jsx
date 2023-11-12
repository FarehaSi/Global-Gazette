import React, { useEffect, useState } from 'react';
import './MostFollowedUsers.css';
import apiFetch from '../../utils/api';
import { Link } from 'react-router-dom';

const MostFollowedUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiFetch('/auth/users/most-followed/');
        setUsers(data.results);
      } catch (error) {
        console.error('Error fetching most followed users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="most-followed-users">
      <h2>Most Followed Users</h2>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="user-info">
              <Link to={`/public/user/${user.id}`}><div className="user-name">{user.full_name || user.username}</div></Link>
              <div className="user-bio">{user.bio}</div>
            </div>
            <span className="badge bg-primary rounded-pill">{user.followers_count} Followers</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostFollowedUsers;
