import React, { useState, useEffect } from 'react';
import apiFetch from '../../../utils/api';

const SelectListTags = ({ selectedTags, onSelect }) => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await apiFetch('/tags');
        setTags(response.results);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  const selectedTagsArray = Array.isArray(selectedTags) ? selectedTags : [];

  return (
    <div>
      <select
        className="form-control"
        value={selectedTagsArray}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
          onSelect(selectedValues);
        }}
        multiple
      >
        <option value="" disabled>Select tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectListTags;
