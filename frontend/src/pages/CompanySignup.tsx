import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/common/Logo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const CompanySignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
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
      const res = await fetch(`${API_BASE_URL}/company/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.companyName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register company");
      }

      navigate("/company/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isValid = Object.values(form).every((v) => v.trim() !== "");

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
              Register your company
            </h1>
            <p className="text-muted-foreground">
              Start hiring top talent today
            </p>
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Name
              </label>
              <Input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Work Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hr@acme.com"
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
              {loading ? "Registering..." : "Register Company"}
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

export default CompanySignup;
