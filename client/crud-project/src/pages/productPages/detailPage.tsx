import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Button from "../../components/common/button";
import Swal from "sweetalert2";

interface Product {
  id: number;
  name: string;
  description: string;
  userId: number;
  image: string;
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate("/");
  };

  const handleEdit = () => {
    if (!product || !currentUserId) return;

    if (currentUserId !== product.userId) {
      Swal.fire({
        icon: "error",
        title: "Forbidden!",
        text: "You are forbidden to edit because you are not the one who owns this product.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    navigate(`/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Product not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.jpg";
              }}
            />
          </div>
          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                Product ID: {product.id} | User ID: {product.userId}
              </p>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={handleBack}
                variant="secondary"
                style={{ width: "auto", padding: "12px 24px" }}
              >
                Back
              </Button>
              <Button
                onClick={handleEdit}
                variant="primary"
                style={{ width: "auto", padding: "12px 24px" }}
              >
                Edit Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
