import React, { useEffect, useState } from 'react';
import apiFetch from '../../../utils/api';
import { CLOUDINARY_URL } from '../../../data/config';
import './User.css';

const User = ({ userId }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await apiFetch(`/auth/users/${userId}`, {}, true);
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

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
                <button className="btn btn-success">Follow</button>
            </div>
        </div>
    );
}

export default User;
