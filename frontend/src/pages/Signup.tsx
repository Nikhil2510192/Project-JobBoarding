import { useNavigate } from "react-router-dom";
import { User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/Logo";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <div className="flex items-center cursor-default">
              <Logo />
            </div>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Already have an account?
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl animate-slide-up">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Join JobPortal
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose how you'd like to get started
            </p>
          </div>

          <div className="space-y-4">
            {/* Job Seeker Card */}
            <button
              onClick={() => navigate("/signup/user")}
              className="w-full p-6 rounded-xl border border-border hover:border-foreground transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary group-hover:bg-foreground group-hover:text-primary-foreground transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    I'm looking for a job
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Find startup jobs, get matched with roles, and discover
                    opportunities
                  </p>
                </div>
              </div>
            </button>

            {/* Company Card */}
            <button
              onClick={() => navigate("/signup/company")}
              className="w-full p-6 rounded-xl border border-border hover:border-foreground transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary group-hover:bg-foreground group-hover:text-primary-foreground transition-colors">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    I'm hiring talent
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Post jobs, browse candidates, and find your next great hire
                  </p>
                </div>
              </div>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            By signing up, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
