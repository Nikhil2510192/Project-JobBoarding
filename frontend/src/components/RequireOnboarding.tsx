import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  // if (!user) return <Navigate to="/login" replace />;

  // if (!user.profileCompleted) {
  //   return <Navigate to="/user/dashboard/profile" replace />;
  // }

  // if (!user.resumeUploaded) {
  //   return <Navigate to="/user/dashboard/resume" replace />;
  // }

  return children;
};

export default RequireOnboarding;