import React from "react";
// import FormInput from "../common/formInput";
import "../../styles/addEditForm.css";
import FormInput from "../common/formInput";
import type { AddEditFormProps } from "../../types/type";

const AddEditForm: React.FC<AddEditFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isEditMode,
  loading,
  error,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="form-subtitle">
            {isEditMode
              ? "Update your product information"
              : "Create a new product to add to your inventory"}
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <div className="error-icon">⚠️</div>
            <span className="error-message">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product Name <span className="required">*</span>
            </label>
            <FormInput
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <FormInput
              type="textarea"
              name="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={onInputChange}
              required
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${loading ? "btn-loading" : ""}`}
            >
              {loading && <div className="btn-spinner"></div>}
              <span>
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Product"
                  : "Create Product"}
              </span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditForm;
