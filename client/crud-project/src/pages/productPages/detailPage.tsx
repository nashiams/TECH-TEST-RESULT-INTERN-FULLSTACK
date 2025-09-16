import { useState, useEffect } from "react";
import { useParams } from "react-router";
// import DetailContent from "./DetailContent";
import "../../styles/detailPage.css";
import DetailContent from "../../components/ui/detailContent";
import type { Product } from "../../types/type";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
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

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setCurrentUserId(payload.id || payload.userId);
        }
      } catch (err) {
        console.error("Failed to get user ID:", err);
      }
    };

    if (id) {
      fetchProduct();
    }
    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-loading-container">
          <div className="detail-spinner"></div>
          <div className="detail-loading-text">Loading product...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-error-container">
          <div className="detail-error-icon">⚠️</div>
          <div className="detail-error-text">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-page">
        <div className="detail-not-found-container">
          <div className="detail-not-found-icon">📦</div>
          <div className="detail-not-found-text">Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <DetailContent
        product={product}
        currentUserId={currentUserId}
        productId={id}
      />
    </div>
  );
}
