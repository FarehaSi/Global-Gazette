import React, { useState, useEffect, useCallback } from 'react';
import SingleComment from './SingleComment';
import apiFetch from '../../../utils/api';
import { useAuth } from '../../../context/ReactQueryContext';

const CommentsSection = ({ articleId, onCommentPosted, refreshKey }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [activeInputId, setActiveInputId] = useState(null);
  const onReplyPosted = () => {
    fetchComments();
  };

  const handleSetActiveInputId = (id) => {
    setActiveInputId(prevActiveInputId => prevActiveInputId === id ? null : id);
  };

  const fetchComments = useCallback(async () => {
    try {
      const response = await apiFetch(`/articles/${articleId}/comments/`);
      if (response) {
        const data = await response;
        const topLevelComments = data.results.filter(comment => !comment.parent_comment);
        setComments(topLevelComments);
      } else {
        console.error('Error fetching comments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [articleId, fetchComments]);
  
  useEffect(() => {
    if (onCommentPosted) {
      fetchComments();
    }
  }, [onCommentPosted, fetchComments]);

  useEffect(() => {
    fetchComments();
}, [articleId, fetchComments, refreshKey]);

  return (
    <div className="comments-section">
      {comments.map(comment => (
        <SingleComment 
          key={comment.id} 
          comment={comment} 
          currentUserId={user?.id} 
          onSetActiveInputId={handleSetActiveInputId}
          isInputActive={activeInputId === comment.id}
          onReplyPosted={onReplyPosted}/>
      ))}
    </div>
  );
};

export default CommentsSection;
