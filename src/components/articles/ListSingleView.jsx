import React from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import "./ListSingleView.css";
import GetTagByName from "./singles/GetTagByName";
import GetCategoryByName from "./singles/GetCategoryByName";

const ListSingleView = ({
  articleId,
  author,
  title,
  snippet,
  date,
  likes,
  comments,
  tags,
  thumbnail,
  category,
}) => {
  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  return (
    <Link
      to={`/articles/${articleId}`}
      className="text-decoration-none text-black"
    >
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8 col-md-7">
            <h6 className="text-muted">{author}</h6>
            <h2>{title}</h2>
            <p dangerouslySetInnerHTML={createMarkup(snippet)}></p>
              <div className="row mt-2">
                <div className="col">
                  <div className=""><GetCategoryByName categoryId={category} /></div>
                </div>
              </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <span className="text-muted">{date}</span>
              <div>
                <span className="pr-3">❤️ {likes}</span>
                <span>💬 {comments}</span>
              </div>
            </div>
            <div>

              <div className="row mt-2">
                <div className="col">
                  {tags &&
                    tags.map((tagId, index) => (
                      <span key={index} className="d-inline-block mr-2">
                        <GetTagByName tagId={tagId} />
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-5">
            <img
              src={thumbnail}
              alt={title}
              className="img-thumbnail"
              style={{ width: "100%", maxWidth: "200px", height: "auto" }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListSingleView;
