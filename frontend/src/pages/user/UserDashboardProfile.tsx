import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const UserDashboardProfile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    location: "", // kept for UI only (not sent to backend)
    experience: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid =
    form.fullName.trim() !== "" &&
    form.headline.trim() !== "" &&
    form.experience.trim() !== "" &&
    form.skills.trim() !== "";

  const handleNext = async () => {
    if (!isValid) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/user/updateprofile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          // Map strictly to Prisma User model
          name: form.fullName,
          bio: null,
          description: form.headline || null,
          experience: Number(form.experience) || null,

          // skills stored as Json array in Prisma
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      const contentType = res.headers.get("content-type");
      let data: any = null;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response (${res.status}). Check API URL or auth.`);
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save profile");
      }

      navigate("/user/dashboard/resume");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      {/* Progress indicator */}
      <div className="mb-10">
        <div className="flex items-center gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-medium text-primary-foreground">
              1
            </span>
            <span className="font-medium text-foreground">Profile</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground">
              2
            </span>
            <span className="text-muted-foreground">Resume</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Complete your profile
        </h1>
        <p className="text-muted-foreground">
          Help employers understand your background and skills
        </p>
      </div>

      <div className="space-y-6">
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="e.g., Rohit Sharma"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Professional Headline
          </label>
          <Input
            name="headline"
            value={form.headline}
            onChange={handleChange}
            placeholder="Frontend Developer · React · TypeScript"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location
          </label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Bengaluru, India"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Years of Experience
          </label>
          <Input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="0 (Fresher), 1, 2..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Skills
          </label>
          <Input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js, SQL"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Add your core skills separated by commas.
          </p>
        </div>

        <Button
          onClick={handleNext}
          className="w-full"
          size="lg"
          disabled={!isValid || loading}
        >
          {loading ? "Saving..." : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserDashboardProfile;
