import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import AuthForm from "../../components/ui/authForm";
// import AuthForm from "./AuthForm";

function AuthPages() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const [shouldNavigate, setShouldNavigate] = useState<string | null>(null);

  // Reset navigation state when location changes
  useEffect(() => {
    setShouldNavigate(null);
  }, [location.pathname]);

  const handleAuthSuccess = (data: any) => {
    if (isLogin) {
      localStorage.setItem("access_token", data.access_token);
      setShouldNavigate("/");
    } else {
      setTimeout(() => {
        setShouldNavigate("/login");
      }, 100);
    }
  };

  if (shouldNavigate && shouldNavigate !== location.pathname) {
    return <Navigate to={shouldNavigate} replace />;
  }

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <p>
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <a href="/register" style={{ color: "blue" }}>
              Register here
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/login" style={{ color: "blue" }}>
              Login here
            </a>
          </>
        )}
      </p>

      <AuthForm isLogin={isLogin} onSuccess={handleAuthSuccess} />

      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          color: "gray",
        }}
      ></div>
    </div>
  );
}

export default AuthPages;
