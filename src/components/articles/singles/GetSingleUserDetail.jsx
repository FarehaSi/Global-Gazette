import React, { useState, useEffect } from 'react'
import apiFetch from '../../../utils/api';
import { CLOUDINARY_URL } from '../../../data/config';

const GetSingleUserDetail = ({ userId, imageClass, textClass, timeAgo }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const data = await apiFetch(`/auth/users/${userId}`);
        setUserDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  
  const defaultImageUrl = `https://api.multiavatar.com/${userDetails?.username}.svg`; 

  const profileImageUrl = userDetails?.profile_picture ? `${CLOUDINARY_URL}${userDetails.profile_picture}` : defaultImageUrl;

  return (
    <div className="d-flex align-items-center">
      <img src={profileImageUrl} alt={`${userDetails.username}'s profile`} className={`me-2 ${imageClass}`} style={{width: "44px", height: "44px"}}/>
      <div className={textClass}>
        <h6>{userDetails.username}</h6>
        <p className="text-muted mb-0">{timeAgo}</p>
      </div>
    </div>
  )
}

export default GetSingleUserDetail
