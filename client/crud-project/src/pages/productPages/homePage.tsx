import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/common/button";
import Swal from "sweetalert2";
import "./homePage.css";

interface Product {
  id: number;
  name: string;
  userId: number;
  image: string;
  description?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export function ProductCard({
  product,
  onDelete,
  currentUserId,
}: {
  product: Product;
  onDelete: (id: number) => void;
  currentUserId: number | null;
}) {
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
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <button
          className="delete-button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          title="Delete product"
        >
          {isDeleting ? "..." : "×"}
        </button>
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <div className="product-footer">
          <span className="product-id">ID: {product.id}</span>
          <span className="product-user">User: {product.userId}</span>
        </div>
        <div className="product-actions">
          <button className="view-details-btn">View Details</button>
        </div>
      </div>
    </div>
  );
}

function PaginationComponent({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  const { currentPage, totalPages } = pagination;

  return (
    <div className="pagination">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="secondary"
        style={{ width: "auto", padding: "8px 16px", marginRight: "10px" }}
      >
        Previous
      </Button>

      <div className="pagination-info">
        <span className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              variant={page === currentPage ? "primary" : "secondary"}
              style={{
                width: "auto",
                padding: "8px 12px",
                margin: "0 2px",
                minWidth: "40px",
              }}
            >
              {page}
            </Button>
          ))}
        </span>
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="secondary"
        style={{ width: "auto", padding: "8px 16px", marginLeft: "10px" }}
      >
        Next
      </Button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (page: number = 1, limit: number = 3) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:3000/products?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: ProductsResponse = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

    fetchProducts();
    fetchUserProfile();
  }, []);

  const handlePageChange = (page: number) => {
    fetchProducts(page, pagination.limit);
  };

  const handleProductDelete = (deletedId: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== deletedId));
    setPagination((prev) => ({
      ...prev,
      totalProducts: prev.totalProducts - 1,
    }));
  };

  const handleCreateProduct = () => {
    navigate("/add");
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>Products</h1>
            <p>
              Showing {products.length} of {pagination.totalProducts} products
            </p>
          </div>
          <Button
            onClick={handleCreateProduct}
            variant="primary"
            style={{ width: "auto", padding: "12px 24px" }}
          >
            Create Product
          </Button>
        </div>
      </header>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={handleProductDelete}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <PaginationComponent
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
