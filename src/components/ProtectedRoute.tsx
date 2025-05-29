import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      toast.error("You must be logged in to access this page.");
      navigate("/");
    }
  }, [user, navigate]);

  // Prevent rendering protected content while redirecting
  if (!user?.id) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
