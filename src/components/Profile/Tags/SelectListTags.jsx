import React, { useState, useEffect } from 'react';
import apiFetch from '../../../utils/api';
import Select from 'react-select';

const SelectListTags = ({ selectedTags, onSelect }) => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiFetch('/tags?no_pagination=true');
        const formattedTags = response.map(tag => ({
          value: tag.id,
          label: tag.name,
        }));
        setTags(formattedTags);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  const handleChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    onSelect(values);
  };

  const selectedOptions = tags.filter(tag => selectedTags.includes(tag.value));

  return (
    <div>
      <Select
        defaultValue={selectedOptions}
        isMulti
        name="tags"
        options={tags}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleChange}
      />
    </div>
  );
};

export default SelectListTags;
