import { useState, useEffect } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const UserDashboardProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    location: "",
    experience: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ FIX: Pre-fill form if user data exists
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.name || "",
        headline: user.role || "", // We mapped role to headline
        experience: user.experience ? String(user.experience) : "",
        // Handle skills whether it's an array or string
        skills: Array.isArray(user.skills) 
          ? user.skills.join(", ") 
          : (typeof user.skills === 'string' ? JSON.parse(user.skills).join(", ") : "")
      }));
    }
  }, [user]);

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
          name: form.fullName,
          role: form.headline, // Map headline to role
          description: form.headline, 
          experience: Number(form.experience) || 0,
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save profile");
      }

      if (user) {
        // Update local context
        const updatedUser = { 
            ...user, 
            name: form.fullName,
            role: form.headline,
            profileCompleted: true 
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
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
      {/* Progress UI */}
      <div className="mb-10">
        <div className="flex items-center gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-medium text-primary-foreground">1</span>
            <span className="font-medium text-foreground">Profile</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground">2</span>
            <span className="text-muted-foreground">Resume</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit your profile</h1>
        <p className="text-muted-foreground">Update your background and skills</p>
      </div>

      <div className="space-y-6">
        {error && <p className="text-sm text-red-500">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="e.g., Rohit Sharma" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Professional Headline (Role)</label>
          <Input name="headline" value={form.headline} onChange={handleChange} placeholder="e.g. Frontend Developer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <Input name="location" value={form.location} onChange={handleChange} placeholder="Bengaluru, India" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Years of Experience</label>
          <Input name="experience" value={form.experience} onChange={handleChange} placeholder="2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
          <Input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js" />
        </div>

        <Button onClick={handleNext} className="w-full" size="lg" disabled={!isValid || loading}>
          {loading ? "Saving..." : "Save & Continue"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserDashboardProfile;