import React from 'react'
import User from './PublicUser/User'

const PublicUserProfile = () => {
  return (
    <div className='row'>
        <div className="col-md-8"></div>
        <div className="col-md-4 border-left">
            <User />
        </div>
        
    </div>
    
  )
}

export default PublicUserProfile