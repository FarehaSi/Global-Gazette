import React, { useState } from 'react';
import apiFetch from '../../../utils/api';
import { useQueryClient } from 'react-query';
import Notification from '../Notification';

const Create = () => {
  const [name, setName] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notification
  const queryClient = useQueryClient();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = { name };
      const response = await apiFetch('/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      queryClient.invalidateQueries('categories');
      console.log(response);
      setName('');
      setNotification({ message: 'Category created successfully!', type: 'success' }); // Set success notification
    } catch (error) {
      console.error('There was an error creating the category:', error);
      setNotification({ message: 'Error creating category. Please try again.', type: 'error' }); // Set error notification
    }
  };

  return (
    <div className="container">
      <h2>Create Category</h2>
      <Notification message={notification.message} type={notification.type} /> {/* Display the notification */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            className="form-control mb-3"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default Create;
