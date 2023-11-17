import React, { useState, useEffect } from 'react';
import apiFetch from '../../../utils/api';
import Select from 'react-select';

const SelectList = ({ selectedCategory, onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiFetch('/categories?no_pagination=true');
        const formattedCategories = response.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setCategories(formattedCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  const handleChange = (selectedOption) => {
    onSelect(selectedOption ? selectedOption.value : '');
  };

  const selectedOption = categories.find(option => option.value === selectedCategory);

  return (
    <div>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={selectedOption}
        onChange={handleChange}
        isClearable={true}
        isSearchable={true}
        options={categories}
        placeholder="Select a category"
      />
    </div>
  );
};

export default SelectList;
