import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const CompanySettings = () => {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    location: "",
    website: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load current company profile
  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/company/getcompany-1`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load company profile");
        }

        setForm({
          companyName: data.company?.name || "",
          email: data.company?.email || "",
          location: data.company?.location || "",
          website: data.company?.website || "",
          description: data.company?.description || "",
        });
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Error",
          description: err.message || "Could not load company profile.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/company/updateprofile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: form.companyName,
          description: form.description,
          website: form.website,
          location: form.location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save settings");
      }

      toast({
        title: "Settings saved",
        description: "Your company profile has been updated.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Could not save company settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Company Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your company profile
        </p>
      </div>

      <div className="rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Company Profile
        </h2>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading company details...
          </p>
        ) : (
          <div className="space-y-5">
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
                Contact Email
              </label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hr@company.com"
                disabled
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Email is set during signup and cannot be changed here.
              </p>
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
                Website
              </label>
              <Input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Briefly describe your company, product, and culture..."
                className="flex min-h-[100px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full"
              disabled={saving}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySettings;
