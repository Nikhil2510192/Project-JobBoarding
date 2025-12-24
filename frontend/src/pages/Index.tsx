import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user
    ? <Navigate to="/user/dashboard/profile" replace />
    : <Navigate to="/login" replace />;
};

export default Index;