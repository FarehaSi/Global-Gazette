import React, { useState, useEffect } from 'react';
import apiFetch from '../../../utils/api';

const GetCategoryByName = ({ categoryId }) => {
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiFetch(`/categories/${categoryId}/`);
        setCategory(response);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!category) {
    return <div>Loading...</div>;
  }

  return <b className='text-uppercase font-weight-bold'>{category.name}</b>;
};

export default GetCategoryByName;
