import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import Swal from "sweetalert2";

export function MainLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Opps",
        text: "Kamu belum login",
        icon: "error",
      }).then(() => {
        navigate("/login", { replace: true });
      });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
