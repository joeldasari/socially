import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user?.id) {
      toast.error("You must be logged in to access this page.");
      navigate("/");
    }
  }, [user, navigate, loading]);

  // Prevent rendering protected content while redirecting
  if (!loading && !user?.id) return null;

  if (!loading && user?.id) return children;
};

export default ProtectedRoute;
