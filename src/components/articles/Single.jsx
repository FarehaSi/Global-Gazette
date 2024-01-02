import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import apiFetch from '../../utils/api';
import './articleSkeleton.css'
import UserProfile from './UserProfile';
import ArticleActions from './ArticleActions';
import DOMPurify from 'dompurify';
import { CLOUDINARY_URL } from '../../data/config';
import GetCategoryByName from './singles/GetCategoryByName';
import './Single.css';
import NewComment from './comments/NewComment';
import CommentsSection from './comments/CommentsSection';

const Single = ({ articleId }) => {
  const [isCommentsOpen, setCommentsOpen] = useState(false);
    const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);

    const handleNewCommentOrReply = () => {
        setCommentsRefreshKey(prevKey => prevKey + 1);
    };
    
    const { data: article, error, isLoading } = useQuery(
        ['article', articleId],
        () => apiFetch(`/articles/${articleId}/`, {}, false), 
        {
          refetchOnWindowFocus: true
        }
    );
    const createMarkup = (htmlContent) => {
      return { __html: DOMPurify.sanitize(htmlContent) };
    };

    if (isLoading) {
        return <SkeletonLoader />;
    }
    
    if (error) {
        return <div className="alert alert-danger" role="alert">Error: {error.message}</div>;
    }
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <article>
            <h1 className="mb-4">{article?.title}</h1>
            <GetCategoryByName categoryId={article?.category} />
            {/* "category": 1, */}
            {/* <GetTagByName tagId={1} /> */}
            <span className="text-muted" dangerouslySetInnerHTML={createMarkup(article?.truncated_content)}></span>
            {/* <span className='text-muted'>{article?.truncated_content}</span> */}
            <UserProfile userId={article.author.id} datePosted={article.created_at}/>
            <ArticleActions 
              articleId={article.id} 
              totalComments={article.comment_count} 
              onCommentsToggle={() => setCommentsOpen(!isCommentsOpen)}
              totalLikes={article.like_count}/>
            {article?.thumbnail && (
              <img src={`${CLOUDINARY_URL}${article?.thumbnail}`} alt={article?.title} className="img-fluid rounded" />
            )}
            <div className="mt-4 mb-5 single-content" dangerouslySetInnerHTML={createMarkup(article?.content)}></div>
            <div className="comments-section" id="comments-section">
                <div className="comments-section-header">Comments</div>
                <NewComment articleId={articleId} onCommentPosted={handleNewCommentOrReply} />
                <CommentsSection articleId={articleId} refreshKey={commentsRefreshKey} onCommentPosted={handleNewCommentOrReply} />
            </div>

          </article>
        </div>
      </div>
    </div>
  )
}

export default Single

const SkeletonLoader = () => (
    <div className='container my-5'>
        <div className='row justify-content-center'>
            <div className="col-lg-8">
                <div className="skeleton-loader">
                    <div className="animated-background">
                        <div className="mb-4 skeleton-title"></div>
                        <div className="mb-3 skeleton-img"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text"></div>
                        <div className="skeleton-text"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);