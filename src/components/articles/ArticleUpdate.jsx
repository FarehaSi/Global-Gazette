import React, { useState, useEffect } from "react";
import apiFetch from "../../utils/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Notification from "../../components/Profile/Notification";
import { useNavigate, useParams } from "react-router-dom";
import { CLOUDINARY_URL } from "../../data/config";
import SelectListTags from "../Profile/Tags/SelectListTags";
import SelectList from "../Profile/Categories/SelectList";

const ArticleUpdate = () => {
  const { articleId } = useParams();
  const isNewArticle = !articleId;
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);

  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [],
    thumbnail: null,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (articleId) {
      apiFetch(`/articles/${articleId}/`)
        .then(data => {
          setArticleData(data);
          setCategory(data.category);
          setTags(data.tags);
          setPreviewThumbnail(data.thumbnail);
        })
        .catch(error => setNotification({ message: error.message, type: "error" }));
    }
  }, [articleId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData({ ...articleData, [name]: value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArticleData({ ...articleData, thumbnail: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: "", type: "" });
  
    const formData = new FormData();
    formData.append("title", articleData.title);
    formData.append("content", articleData.content);
    formData.append("category", category);
    tags.forEach(tag => formData.append("tags", tag));
  
    if (articleData.thumbnail) {
      formData.append("thumbnail", articleData.thumbnail);
    }
  
    const endpoint = isNewArticle ? "/articles/" : `/articles/${articleId}/edit/`;
    const method = isNewArticle ? "POST" : "PUT";
  
    try {
      const response = await apiFetch(endpoint, {
        method: method,
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      setNotification({
        message: `Article ${isNewArticle ? "created" : "updated"} successfully!`,
        type: "success",
      });
      setTimeout(() => {
        navigate("/profile/my-posts");
      }, 2000);
    } catch (error) {
      setNotification({ message: error.message, type: "error" });
    }
  };

  
  useEffect(() => {
    setArticleData(prevData => ({ ...prevData, category, tags }));
  }, [category, tags]);
    
  
  
  

  return (
    <div className="create-article-container">
      <div className="container mt-5">
        <div className="card border-0 shadow">
          <div className="card-header bg-primary text-white">
            {isNewArticle ? "Create New Article" : "Update Article"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <Notification message={notification.message} type={notification.type} />
              <div className="form-group text-center">
                <label htmlFor="thumbnail" className="form-label">
                  Article Thumbnail
                </label>
                <input
                  type="file"
                  className="form-control-file"
                  id="thumbnail"
                  name="thumbnail"
                  onChange={handleThumbnailChange}
                />
                {previewThumbnail && (
                  <img
                    src={`${CLOUDINARY_URL}${previewThumbnail}`}
                    alt="Article Thumbnail"
                    className="img-thumbnail mt-3"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                )}
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={articleData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <ReactQuill
                  theme="snow"
                  value={articleData.content}
                  onChange={(content) => setArticleData({ ...articleData, content })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <SelectList
                  selectedCategory={category} 
                  onSelect={(selectedValue) => setCategory(selectedValue)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <SelectListTags
                  selectedTags={tags}
                  onSelect={(selectedValue) => setTags(selectedValue)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {isNewArticle ? "Create" : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleUpdate;
