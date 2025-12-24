import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import Logo from "./Logo";
import Button from "./Button";
import { useAuth } from "@/context/AuthContext";

interface NavLink {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavLink[] = [
    { name: "Discover", href: "/user/discover" },
    { name: "For Job Seekers", href: "/signup/user" },
    { name: "For Companies", href: "/signup/company" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-default">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth / User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col space-y-2 pt-4 border-t">
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-700 px-1">
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" fullWidth>
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
