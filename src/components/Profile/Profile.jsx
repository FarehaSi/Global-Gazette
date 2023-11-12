import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/ReactQueryContext';
import { useMutation } from 'react-query';
import apiFetch from '../../utils/api';
import { CLOUDINARY_URL, SERVER_URL } from '../../data/config';
import Notification from './Notification';

const Profile = () => {
    const { user } = useAuth();
    const [fullName, setFullName] = useState(user?.full_name);
    const [bio, setBio] = useState(user?.bio);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profile_picture);
    const fileInputRef = useRef(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const updateUserProfileMutation = useMutation(
        (formData) => apiFetch('/auth/me/update', {
            method: 'PUT',
            body: formData,
        }, true, false),
        {
            onSuccess: (data) => {
                setNotification({ message: 'Profile updated successfully!', type: 'success' });
            },
            onError: (error) => {
                console.error('Update profile error:', error);
                setNotification({ message: `'Failed to update profile. ${error}`, type: 'error' });
            },
        }
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setNotification({ message: '', type: '' });
        const formData = new FormData();
        if (selectedFile) {
            formData.append('profile_picture', selectedFile);
        }
        formData.append('full_name', fullName);
        formData.append('bio', bio);

        updateUserProfileMutation.mutate(formData);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(user?.profile_picture);
            return;
        }
        
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile, user?.profile_picture]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Profile Information</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                <Notification message={notification.message} type={notification.type} />
                                <img 
                                    src={selectedFile ? previewUrl : (user?.profile_picture ? `${CLOUDINARY_URL}${user.profile_picture}` : `https://api.multiavatar.com/${user?.username}.png`)} 
                                    alt="Profile" 
                                    className="img-thumbnail mb-2" 
                                    style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={triggerFileInput}
                                />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="d-none"
                                    onChange={handleFileChange}
                                />
                            </div>
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">Full Name:</label>
                                    <input 
                                        id="fullName"
                                        type="text" 
                                        className="form-control" 
                                        value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Bio:</label>
                                    <textarea 
                                        id="bio"
                                        className="form-control" 
                                        value={bio} 
                                        onChange={(e) => setBio(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={updateUserProfileMutation.isLoading}>
                                    Update Profile
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
