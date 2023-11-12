import React, { useState, useEffect } from 'react';
import apiFetch from '../../../utils/api';

const SelectList = ({ selectedCategory, onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiFetch('/categories');
        setCategories(response.results); // Update to use 'results' instead of 'data'
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <select
        className="form-control"
        value={selectedCategory}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectList;
