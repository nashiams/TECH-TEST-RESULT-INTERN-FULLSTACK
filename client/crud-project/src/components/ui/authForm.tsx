import { useState, useEffect } from "react";
import FormInput from "../common/formInput";
import Button from "../common/button";
import type { AuthFormProps } from "../../types/type";

function AuthForm({ isLogin, onSuccess }: AuthFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setFormData({ username: "", password: "" });
  }, [isLogin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      const data = await response.json();
      console.log("Success:", data);

      onSuccess(data);
    } catch (err: any) {
      console.error("Error:", err);
      setError(
        err.message ||
          "Network error occurred. Make sure the server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid red",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <FormInput
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <FormInput
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <Button type="submit" disabled={loading} variant="primary">
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </Button>
      </form>
    </>
  );
}

export default AuthForm;
