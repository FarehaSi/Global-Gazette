import React, { useEffect, useState } from 'react'
import apiFetch from '../../../utils/api';
import { CLOUDINARY_URL } from '../../../data/config';
import './User.css'

const User = () => {
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const data = await apiFetch('/auth/users/5', {}, true);
            setUserData(data);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUserData();
      }, []);
    
      if (!userData) {
        return <div>Loading...</div>;
      }
  return (
    <div className="user-profile-container">
      <img 
        src={`${CLOUDINARY_URL}${userData.profile_picture}`} 
        alt={`${userData.full_name}'s profile`} 
        className="user-profile-picture"
      />
      <div className="user-details">
        <h3>{userData.full_name}</h3>
        <p>{userData.followers_count} Followers</p>
        <p>{userData.bio}</p>
        <p>{userData.email}</p>
        <button className="btn btn-success">Follow</button>
      </div>
    </div>
  )
}

export default User