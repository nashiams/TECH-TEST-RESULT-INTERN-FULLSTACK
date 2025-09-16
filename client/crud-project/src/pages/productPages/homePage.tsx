import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "../../styles/homePage.css";
import Button from "../../components/common/button";
import ProductCard from "../../components/ui/productCard";
import PaginationComponent from "../../components/ui/pagination";
import type { Pagination, Product, ProductsResponse } from "../../types/type";

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

  const fetchProducts = async (page: number = 1, limit: number = 4) => {
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <Button onClick={() => fetchProducts()} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">
                Discover Amazing Products
                <span className="title-accent"></span>
              </h1>
              <p className="page-subtitle">
                Explore our curated collection of {pagination.totalProducts}{" "}
                premium products
              </p>
              <div className="stats-badge">
                Showing {products.length} of {pagination.totalProducts} products
              </div>
            </div>
            <div className="header-action">
              <Button onClick={handleCreateProduct} variant="primary">
                <span className="btn-icon">+</span>
                Create Product
              </Button>
              <div style={{ marginLeft: "12px" }}>
                <Button onClick={handleLogout} variant="secondary">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Start by creating your first product!</p>
              <Button onClick={handleCreateProduct} variant="primary">
                Create Product
              </Button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
