import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  FileText,
  BarChart3,
  MessageSquare,
  Search,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext"; // Import Auth Hook

const menuItems = [
  { icon: Home, label: "Home", path: "/user/home" },
  { icon: User, label: "Profile", path: "/user/dashboard/profile" },
  { icon: FileText, label: "Resume", path: "/user/dashboard/resume" },
  { icon: BarChart3, label: "AI Insights", path: "/user/insights" },
  { icon: MessageSquare, label: "Messages", path: "/user/messages" },
  { icon: Search, label: "Discover Jobs", path: "/user/discover" },
];

export const UserSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); // Get logout function
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Force navigation to login/welcome
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r border-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex items-center cursor-default">
            <Logo />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout - CHANGED TO BUTTON */}
        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};