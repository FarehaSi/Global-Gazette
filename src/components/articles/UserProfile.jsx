import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import timeAgo from '../../utils/timeAgo';
import apiFetch from '../../utils/api';
import { CLOUDINARY_URL } from '../../data/config';
import { Link } from 'react-router-dom';

const useUser = (userId) => {
  return useQuery(['user', userId], async () => {
    return apiFetch(`/auth/users/${userId}/`);
  });
};

const UserProfile = ({ userId, datePosted }) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError, error } = useUser(userId);
  const [isFollowing, setIsFollowing] = useState(null);
  
  const followMutation = useMutation(
    () => apiFetch(`/auth/follow/${userId}/`, {
      method: 'POST',
      headers: {
        
      }
    }),
    {
      onSuccess: (data) => {
        setIsFollowing((prev) => !prev);
        queryClient.invalidateQueries(['user', userId]);
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const handleFollowClick = () => {
    // Call the mutation to follow/unfollow user
    followMutation.mutate();
  };

  const getAvatarUrl = (name) => {
    return `https://api.multiavatar.com/${encodeURIComponent(name)}.png`;
  };

  const imageUrl = `${CLOUDINARY_URL}${user?.profile_picture}` || getAvatarUrl(user?.full_name || user?.username);

  return (
    <div className="d-flex flex-col align-items-center justify-content-start py-3">
      <img
        src={imageUrl}
        className="rounded-circle me-2"
        alt="Profile"
        style={{ width: '48px', height: '48px' }}
      />
      <div>
        <div className='row'>
          <Link to={`/public/user/${user?.id}`} className="col fw-bold">{user?.full_name || user?.username}</Link>
          <button
            className={`col btn ${isFollowing ? 'btn-secondary' : 'btn-success'} ms-auto`}
            onClick={handleFollowClick}
            disabled={followMutation.isLoading}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
        <div className="col text-muted">{timeAgo(datePosted)}</div>
      </div>
    </div>
  );
};

export default UserProfile;
