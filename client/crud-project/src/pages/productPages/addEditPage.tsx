import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import AddEditForm from "../../components/ui/addEditForm";
import type { Product, ProductForm } from "../../types/type";
// import AddEditForm from "../components/AddEditForm/AddEditForm";

export default function AddEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        setFetchingProduct(true);
        try {
          const token = localStorage.getItem("access_token");
          const response = await fetch(`http://localhost:3000/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }

          const product: Product = await response.json();
          setFormData({
            name: product.name,
            description: product.description ?? "",
          });
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch product"
          );
        } finally {
          setFetchingProduct(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (formData: ProductForm) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const url = isEditMode
        ? `http://localhost:3000/products/${id}`
        : "http://localhost:3000/products";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isEditMode ? "update" : "create"} product`
        );
      }

      // Navigate back to home page after successful operation
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (fetchingProduct) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AddEditForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditMode={isEditMode}
        loading={loading}
        error={error}
      />
    </div>
  );
}
