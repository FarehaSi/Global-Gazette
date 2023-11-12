import React, { useState } from 'react';
import apiFetch from '../../../utils/api';
import { useQueryClient } from 'react-query';
import Notification from '../Notification';

const Create = () => {
  const [name, setName] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' }); 
  const queryClient = useQueryClient();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = { name };
      const response = await apiFetch('/tags/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      queryClient.invalidateQueries('tags');
      console.log(response);
      setName('');
      setNotification({ message: 'Tag created successfully!', type: 'success' }); 
    } catch (error) {
      console.error('There was an error creating the Tag:', error);
      setNotification({ message: 'Error creating Tag. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="container">
      <h2>Create Tag</h2>
      <Notification message={notification.message} type={notification.type} /> 
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="TagName">Tag Name</label>
          <input
            type="text"
            className="form-control mb-3"
            id="TagName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Create Tag
        </button>
      </form>
    </div>
  );
};

export default Create;
