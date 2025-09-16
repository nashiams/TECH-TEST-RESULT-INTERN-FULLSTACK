import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import type { ProductCardProps } from "../../types/type";

export default function ProductCard({
  product,
  onDelete,
  currentUserId,
}: ProductCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCardClick = () => {
    navigate(`/detail/${product.id}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is authorized to delete this product
    if (currentUserId !== product.userId) {
      Swal.fire({
        icon: "error",
        title: "Forbidden!",
        text: "You are forbidden to delete because you are not the one who owns this product.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    // Confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:3000/products/${product.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      onDelete(product.id);

      Swal.fire({
        title: "Deleted!",
        text: "Product has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete product. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="image-overlay">
          <div className="overlay-content">
            <span className="view-text">View Details</span>
          </div>
        </div>
        <button
          className="delete-button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          title="Delete product"
        >
          {isDeleting ? (
            <div className="delete-spinner"></div>
          ) : (
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>×</span>
          )}
        </button>
      </div>

      <div className="product-content">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
          <div className="product-badge">
            <span className="badge-dot"></span>
            New
          </div>
        </div>

        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-meta">
          <div className="meta-item">
            <span className="meta-label">ID</span>
            <span className="meta-value">#{product.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Owner</span>
            <span className="meta-value">User {product.userId}</span>
          </div>
        </div>

        <div className="product-footer">
          <button className="view-details-btn">
            <span>View Details</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
</svg>;
