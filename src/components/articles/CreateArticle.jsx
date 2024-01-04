import React, { useEffect, useState } from "react";
import apiFetch from "../../utils/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Notification from "../../components/Profile/Notification";
import "./CreateArticle.css";
import { useNavigate } from "react-router-dom";
import SelectList from "../Profile/Categories/SelectList";
import SelectListTags from "../Profile/Tags/SelectListTags";

const CreateNewArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({});
  const history = useNavigate();

  useEffect(() => {
    if (notification.type === "success") {
      const timer = setTimeout(() => {
        history("/profile/my-posts");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [notification, history]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
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
    setErrors({});

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    tags.forEach((tag) => formData.append("tags", tag));
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    try {
      await apiFetch("/articles/", {
        method: "POST",
        body: formData,
      });
      setNotification({
        message: "Article created successfully!",
        type: "success",
      });
    } catch (error) {
      // console.error(error);
      setErrors(error.response.data);
    }
  };
  const isFormValid = () => {
    return title.trim() !== "" && content.trim() !== "";
  };

  return (
    <div className="create-article-container">
      <div className="container mt-5">
        <div className="card border-0 shadow">
          <div className="card-header bg-primary text-white">
            Create New Article
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <Notification
                message={notification.message}
                type={notification.type}
              />
              {errors.title && <div className="error">{errors.title[0]}</div>}
              {errors.content && <div className="error">{errors.content[0]}</div>}
              <div className="form-group text-center">
                <label htmlFor="thumbnail" className="form-label">
                  Article Thumbnail
                </label>
                <input
                  type="file"
                  className="form-control-file"
                  id="thumbnail"
                  onChange={handleThumbnailChange}
                />
                {previewThumbnail && (
                  <img
                    src={previewThumbnail}
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
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
              <button type="submit" className="btn btn-primary"  disabled={!isFormValid()}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewArticle;
