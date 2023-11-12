import React, { useState } from 'react';
import './SingleComment.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faReply, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import apiFetch from '../../../utils/api';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import GetSingleUserDetail from '../singles/GetSingleUserDetail';
import timeAgo from '../../../utils/timeAgo';

const SingleComment = ({ 
  comment,
  onReplyPosted,
  currentUserId,
  onSetActiveInputId,
  isInputActive,
  activeInputId,
 }) => {
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [liked, setLiked] = useState(comment.is_liked || false);
  const [replyText, setReplyText] = useState('');
  const isOwnedByCurrentUser = comment.user === currentUserId;
  
  const handleEdit = () => {
    console.log('Edit Comment', comment.id);
  };

  const handleDelete = () => {
    console.log('Delete Comment', comment.id);
  };

  const toggleReplyInput = () => {
    onSetActiveInputId(isInputActive ? null : comment.id);
  };

  const handleLike = async () => {
    try {
      const response = await apiFetch(`/comments/${comment.id}/react/like/`, { method: 'POST' });

      if (response.detail === "Reaction 'like' set.") {
        setLikeCount(prevCount => prevCount + 1); 
        setLiked(true);
      } else if (response.detail === "Reaction 'like' removed.") {
        setLikeCount(prevCount => prevCount - 1);
        setLiked(false);
      }
    } catch (error) {
      console.error('Error liking the comment:', error);
    }
  };

  const handleSubmitReply = async () => {
    try {
      const response = await apiFetch(`/comments/${comment.id}/reply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: replyText,
          article: comment.article,
          parent_comment: comment.id
        })
      });

      if (response.id) {
        setReplyText('');
        onSetActiveInputId(null);
        onReplyPosted(); 
      } else {
        console.error('Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting the reply:', error);
    }
  };

  


  const renderReplies = (replies) => {
    const filteredReplies = replies.filter(reply => !reply.hasBeenRendered);

    return filteredReplies.map(reply => (
      <div className="media py-3" key={reply.id} style={{ marginLeft: '20px' }}>
        <SingleComment
          comment={{ ...reply, hasBeenRendered: true }}
          onReplyPosted={onReplyPosted}
          currentUserId={currentUserId}
          onSetActiveInputId={onSetActiveInputId}
          isInputActive={activeInputId === reply.id}
          activeInputId={activeInputId}
        />
      </div>
    ));
  };

  const userDetailComponent = (
    <GetSingleUserDetail
      userId={comment.user}
      imageClass="img-thumbnail rounded-circle"
      textClass="small"
    />
  );

  return (
    <div className={`media py-3 ${isOwnedByCurrentUser ? 'user-owned-comment' : ''}`}>
      <div className="media-left align-self-start mr-3">
        <GetSingleUserDetail
          userId={comment.user}
          imageClass="img-thumbnail rounded-circle user-avatar"
          textClass="small"
          timeAgo={timeAgo(comment.created_at)}
        />
      </div>
      <div className="media-body">
      <div className="row align-items-center mt-0 user-name">
        <span className="col-auto">{comment.userName}</span>
    </div>

        <p className="comment-text">{comment.text}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <button className={`btn like-button btn-sm ${liked ? 'liked' : ''}`} onClick={handleLike}>
              <FontAwesomeIcon icon={faThumbsUp} /> <span className="like-count">{likeCount}</span>
            </button>
            <button className="btn reply-button btn-sm ml-2" onClick={toggleReplyInput}>
              <FontAwesomeIcon icon={faReply} /> Reply
            </button>
          </div>
          {isOwnedByCurrentUser && (
            <div className="btn-group">
              <button className="btn btn-sm dropdown-toggle comment-options-button" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <button className="dropdown-item" onClick={handleEdit}>Edit</button>
                <button className="dropdown-item" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          )}
        </div>
        {isInputActive && (
          <div className="reply-form mt-3">
            <textarea
              className="form-control"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            ></textarea>
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              Submit Reply
            </button>
            <button
              className="btn btn-secondary btn-sm mt-2"
              onClick={() => onSetActiveInputId(null)}
            >
              Cancel
            </button>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="nested-comments">
            {renderReplies(comment.replies)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleComment;
