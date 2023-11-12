import React, { useEffect, useState } from 'react';
import apiFetch from '../../../utils/api';
import { CLOUDINARY_URL } from '../../../data/config';
import './User.css';

const User = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowActionLoading, setIsFollowActionLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiFetch(`/auth/users/${userId}`, {}, true);
                setUserData(data);
                setIsFollowing(data.is_following); // Assuming the API returns whether the current user is following
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleFollowClick = async () => {
        setIsFollowActionLoading(true);
        try {
            // Toggle follow state based on current state
            const endpoint = isFollowing ? `/auth/unfollow/${userId}/` : `/auth/follow/${userId}/`;
            await apiFetch(endpoint, { method: 'POST' }, true);
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            setIsFollowActionLoading(false);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    const profilePictureUrl = userData.profile_picture
        ? `${CLOUDINARY_URL}${userData.profile_picture}`
        : `https://api.multiavatar.com/${encodeURIComponent(userData.username)}.svg`;

    return (
        <div className="user-profile-container">
            <img 
                src={profilePictureUrl} 
                alt={`${userData.full_name || userData.username}'s profile`} 
                className="user-profile-picture"
            />
            <div className="user-details">
                <h3>{userData.full_name || userData.username}</h3>
                <p>{userData.followers_count} Followers</p>
                <p>{userData.bio}</p>
                <p>{userData.email}</p>
                <button 
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-success'}`} 
                    onClick={handleFollowClick} 
                    disabled={isFollowActionLoading}>
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
        </div>
    );
}

export default User;
