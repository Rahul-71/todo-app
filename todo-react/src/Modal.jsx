import React, { useState } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          
          <div className="modal-input">
            <div className="modal-input-item">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's the title?"
              />
            </div>
            <div className="modal-input-item">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Add any description..."
              />
            </div>
            <div className="modal-input-item">
              <button
                type="submit"
                onClick={handleSubmit}
                className="primary-btn"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
