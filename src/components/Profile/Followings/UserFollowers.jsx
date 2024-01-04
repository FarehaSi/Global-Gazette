import React from 'react';
import { useQuery } from 'react-query';
import apiFetch from '../../../utils/api';
import './UserFollowers.css';
import { CLOUDINARY_URL } from '../../../data/config';
import { Link } from 'react-router-dom';

const UserFollowers = () => {
  const generateAvatarUrl = (username) => `https://api.multiavatar.com/${encodeURIComponent(username)}.svg`;
  
  const { data: followers, isLoading, isError, error } = useQuery(
    'userFollowers',
    () => apiFetch('/auth/me/followers/')
  );

  if (isLoading) {
    return <div className="text-center"><span>Loading followers...</span></div>;
  }

  if (isError) {
    return <div className="text-danger"><span>Error: {error.message}</span></div>;
  }

  return (
    <div className="container">
      <h2 className="text-left mb-4">People who follow you:</h2>
      <div className="row">
        {followers.map((follower) => (
          <div key={follower.id} className="col-md-2 col-sm-6 mb-3">
            <Link to={`/public/user/${follower.id}`}>
              <div className="follower-card p-3 text-center">
                <img
                  src={follower.profile_picture ? `${CLOUDINARY_URL}${follower.profile_picture}` : generateAvatarUrl(follower.full_name || follower.username)}
                  alt={follower.full_name}
                  className="img-fluid mb-2 follower-image"
                />
                <div className="fw-bold">{follower.full_name || follower.username}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFollowers;
