import React, { useState, useEffect } from "react";
import Button from "../../components/common/button";
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

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-footer">
          <span className="product-id">ID: {product.id}</span>
          <span className="product-user">User: {product.userId}</span>
        </div>
      </div>
    </div>
  );
};

const PaginationComponent: React.FC<{
  pagination: Pagination;
  onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => {
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
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
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
    fetchProducts();
  }, []);

  const handlePageChange = (page: number) => {
    fetchProducts(page, pagination.limit);
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
        <h1>Products</h1>
        <p>
          Showing {products.length} of {pagination.totalProducts} products
        </p>
      </header>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
