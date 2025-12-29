import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Access context to update state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [userType, setUserType] = useState<"user" | "company">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      const url =
        userType === "user"
          ? `${API_BASE_URL}/user/login`
          : `${API_BASE_URL}/company/login`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      if (userType === "user") {
        // Update context immediately so the app knows we are logged in
        if (data.user) {
           setUser(data.user);
           localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Navigate to HOME, not profile. 
        // RequireOnboarding in App.tsx will redirect to profile/resume ONLY if needed.
        navigate("/user/home"); 
      } else {
        navigate("/company/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.email.trim() !== "" && form.password.trim() !== "";

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
              Don't have an account?
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* User Type Toggle */}
          <div className="mb-8 flex rounded-full bg-secondary p-1">
            <button
              type="button"
              onClick={() => setUserType("user")}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
                userType === "user"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setUserType("company")}
              className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
                userType === "company"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Company
            </button>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isValid || loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;