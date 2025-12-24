import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/common/Logo";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/company/dashboard" },
  { icon: Briefcase, label: "Posted Jobs", path: "/company/jobs" },
  { icon: Users, label: "Candidates", path: "/company/candidates" },
  { icon: Settings, label: "Settings", path: "/company/settings" },
];

export const CompanySidebar = () => {
  const location = useLocation();

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
            const isActive = location.pathname.startsWith(item.path);
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

        {/* Logout */}
        <div className="border-t border-border p-3">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
