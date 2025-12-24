import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/common/Logo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const UserSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
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
      const res = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",

        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      // On success: backend sets cookie, then go to profile step
      navigate("/user/dashboard/profile");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    form.fullName.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "";

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
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Start your job search journey
            </p>
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
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

            <Button
              type="submit"
              className="w-full mt-6"
              size="lg"
              disabled={!isValid || loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/signup")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to options
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserSignup;
