import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth";

export default function AdminGuard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}