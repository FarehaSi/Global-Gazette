import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import timeAgo from '../../utils/timeAgo';
import apiFetch from '../../utils/api';
import { CLOUDINARY_URL } from '../../data/config';
import { Link, useNavigate } from 'react-router-dom';

const useUser = (userId) => {
  return useQuery(['user', userId], () => apiFetch(`/auth/users/${userId}/`, {}, true));
};

const UserProfile = ({ userId, datePosted }) => {
  const queryClient = useQueryClient();
  const history = useNavigate();
  const { data: user, isLoading, isError, error } = useUser(userId);
  const [isFollowActionLoading, setIsFollowActionLoading] = React.useState(false);

  const followMutation = useMutation(
    () => {
      const endpoint = user.is_following ? `/auth/unfollow/${userId}/` : `/auth/follow/${userId}/`;
      return apiFetch(endpoint, { method: 'POST' }, true);
    },
    {
      onSuccess: () => {
        // Optimistically update the user data in the query cache
        queryClient.setQueryData(['user', userId], (oldData) => {
          return {...oldData, is_following: !oldData.is_following};
        });
      },
    }
  );

  const handleFollowClick = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      history('/login');
      return;
    }
    setIsFollowActionLoading(true);
    followMutation.mutate({}, {
      onSuccess: () => {
        setIsFollowActionLoading(false);
      },
      onError: () => {
        setIsFollowActionLoading(false);
      }
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const imageUrl = user?.profile_picture 
    ? `${CLOUDINARY_URL}${user.profile_picture}` 
    : `https://api.multiavatar.com/${encodeURIComponent(user?.full_name || user?.username)}.png`;

  return (
    <div className="d-flex flex-col align-items-center justify-content-start py-3">
      <img src={imageUrl} alt="Profile" className="rounded-circle me-2" style={{ width: '48px', height: '48px' }} />
      <div>
        <div className='row'>
          <Link to={`/public/user/${user?.id}`} className="col fw-bold">{user?.full_name || user?.username}</Link>
          <button
            className={`col btn ${user.is_following ? 'btn-secondary' : 'btn-success'} ms-auto`}
            onClick={handleFollowClick}
            disabled={isFollowActionLoading}
          >
            {user.is_following ? 'Unfollow' : 'Follow'}
          </button>
        </div>
        <div className="col text-muted">{timeAgo(datePosted)}</div>
      </div>
    </div>
  );
};

export default UserProfile;
