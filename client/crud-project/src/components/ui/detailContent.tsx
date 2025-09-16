import { useNavigate } from "react-router";
// import Button from "../../components/common/button";
import Swal from "sweetalert2";
import Button from "../common/button";
import type { DetailContentProps } from "../../types/type";

export default function DetailContent({
  product,
  currentUserId,
  productId,
}: DetailContentProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = () => {
    if (!product || !currentUserId) return;

    if (currentUserId !== product.userId) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You can only edit products that you own.",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Got it",
        background: "#ffffff",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
        },
      });
      return;
    }

    navigate(`/edit/${productId}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/placeholder-image.jpg";
  };

  return (
    <div className="detail-content">
      <div className="detail-product-card">
        <div className="detail-image-container">
          <img
            src={product.image}
            alt={product.name}
            className="detail-product-image"
            onError={handleImageError}
          />
          <div className="detail-image-overlay">
            <span className="detail-product-id-badge">#{product.id}</span>
          </div>
        </div>

        <div className="detail-product-info">
          <div className="detail-product-header">
            <h1 className="detail-product-title">{product.name}</h1>
            <div className="detail-product-meta">
              <div className="detail-meta-item">
                <span className="detail-meta-label">Product ID</span>
                <span className="detail-meta-value">{product.id}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-meta-label">Owner ID</span>
                <span className="detail-meta-value">{product.userId}</span>
              </div>
            </div>
          </div>

          <div className="detail-description-section">
            <h2 className="detail-section-title">Description</h2>
            <p className="detail-product-description">{product.description}</p>
          </div>

          <div className="detail-action-buttons">
            <Button
              onClick={handleBack}
              variant="secondary"
              style={{
                width: "auto",
                padding: "14px 28px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              ← Back to Products
            </Button>
            <Button
              onClick={handleEdit}
              variant="primary"
              style={{
                width: "auto",
                padding: "14px 28px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Edit Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
