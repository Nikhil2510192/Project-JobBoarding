import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";

const OnboardingLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <div className="h-16 border-b border-border flex items-center justify-end px-6">
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;