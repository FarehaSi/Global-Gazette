import React from 'react'
import User from './PublicUser/User'
import { useParams } from 'react-router-dom'
import UserArticles from './PublicUser/UserArticles';
import './PublicUserProfile.css';
import MostFollowedUsers from '../home/MostFollowedUsers';

const PublicUserProfile = () => {
    const {userId} = useParams();
    return (
        <div className='row'>
            <div className="col-md-8">
                <UserArticles userId={userId} />
            </div>
            <div className="col-md-4 sticky-user-profile border-left">
                <User userId={userId} />
                <MostFollowedUsers />
            </div>
        </div>
    )
}

export default PublicUserProfile
