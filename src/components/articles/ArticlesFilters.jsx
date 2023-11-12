import React from 'react';
import SelectList from '../Profile/Categories/SelectList';

const ArticlesFilters = ({ onAllPostsClick, onFollowedWritersClick, selectedCategory, onCategoryChange }) => {
  return (
    <div className='d-flex justify-content-center'>
        <div className="btn-group" role="group" aria-label="Post buttons">
            <button type="button" className="btn btn-primary" onClick={onAllPostsClick}>All Posts</button>
            <button type="button" className="btn btn-secondary" onClick={onFollowedWritersClick}>Posts by Followed Writers</button>
            <button type="button" className="btn btn-secondary"><SelectList selectedCategory={selectedCategory} onSelect={onCategoryChange} /></button>
        </div>
    </div>
  )
}

export default ArticlesFilters;
