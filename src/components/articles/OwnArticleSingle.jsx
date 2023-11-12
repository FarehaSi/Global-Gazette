import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import './ListSingleView.css'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import apiFetch from '../../utils/api';

const OwnArticleSingle = ({ articleId, author, title, snippet, date, likes, comments, tags, thumbnail }) => {
    const [showMenu, setShowMenu] = useState(false);
    // const queryClient = useQuery();
    const history = useNavigate();
    const queryClient = useQueryClient();

    const createMarkup = (htmlContent) => {
        return { __html: DOMPurify.sanitize(htmlContent) };
    };

    const deleteMutation = useMutation(() => apiFetch(`/articles/${articleId}/delete/`, {
        method: 'DELETE',
    }), {
        onSuccess: () => {
            setShowMenu(false);
            alert('Article deleted successfully');
            queryClient.invalidateQueries(['articles']);
            // navigate('/articles');
        },
        onError: () => {
            setShowMenu(false);
            alert('Failed to delete the article');
        }
    });



    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleEdit = () => {
        history(`/articles/${articleId}/update`)
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            setShowMenu(false); 
            deleteMutation.mutate();
        }
    };

    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8 col-md-7">
            <div className="d-flex justify-content-between">
              <h6 className="text-muted">{author}</h6>
              <div>
                <button onClick={toggleMenu} className="btn">
                  <span className="text-muted">&#x22EE;</span>
                </button>
                {showMenu && (
                  <div className="dropdown-menu show">
                    <button onClick={handleEdit} className="dropdown-item">Edit</button>
                    <button onClick={handleDelete} className="dropdown-item">Delete</button>
                  </div>
                )}
              </div>
            </div>
            <Link to={`/articles/${articleId}`} className="text-decoration-none text-black">
              <h2>{title}</h2>hsjdhs
              <p dangerouslySetInnerHTML={createMarkup(snippet)}></p>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="text-muted">{date}</span>
                <div>
                  <span className="pr-3">❤️ {likes}</span>
                  <span>💬 {comments}</span>
                </div>
              </div>
              <div className="mt-2">
                {tags.map((tag, index) => (
                  <span key={index} className="badge badge-primary mr-1">{tag}</span>
                ))}
              </div>
            </Link>
          </div>
          <div className="col-lg-4 col-md-5">
            <img src={thumbnail} alt={title} className="img-thumbnail" style={{ width: '100%', maxWidth: '200px', height: 'auto' }} />
          </div>
        </div>
      </div>
    )
}

export default OwnArticleSingle;
