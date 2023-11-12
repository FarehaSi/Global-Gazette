import React, { useState, useEffect } from 'react';
import apiFetch from '../../../utils/api';
import './GetTagName.css';

const GetTagByName = ({ tagId }) => {
  const [tag, setTag] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await apiFetch(`/tags/${tagId}/`);
        setTag(response);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      }
    };

    fetchTag();
  }, [tagId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tag) {
    return <div>Loading...</div>;
  }

  return <div className='tag-style mx-1'>{tag.name}</div>;
};

export default GetTagByName;
