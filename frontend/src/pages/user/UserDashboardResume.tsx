import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const UserDashboardResume = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selected: File | null) => {
    setFile(selected);
  };

  const handleComplete = async () => {
    if (!file) {
      // If user already has a resume and just clicks complete, let them pass
      if (user?.resumeUploaded) {
         navigate("/user/home");
         return;
      }
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1) Get Signature
      const sigRes = await fetch(`${API_BASE_URL}/resume/signature`, {
        method: "GET",
        credentials: "include",
      });
      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData?.message || "Failed to get signature");
      const { signature, apiKey, cloudName, timestamp, folder } = sigData;

      // 2) Upload to Cloudinary
      const cloudForm = new FormData();
      cloudForm.append("file", file);
      cloudForm.append("api_key", apiKey);
      cloudForm.append("timestamp", String(timestamp));
      cloudForm.append("folder", folder || "resume");
      cloudForm.append("signature", signature);

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, { method: "POST", body: cloudForm });
      const cloudJson = await cloudRes.json();
      if (!cloudRes.ok) throw new Error(cloudJson?.error?.message || "Cloudinary upload failed");
      const { secure_url, public_id } = cloudJson;

      // 3) Save to Backend
      const saveRes = await fetch(`${API_BASE_URL}/resume/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resumeUrl: secure_url, cloudinaryId: public_id }),
      });
      const data = await saveRes.json();
      if (!saveRes.ok) throw new Error(data?.message || "Save resume failed");

      if (user) {
        const updatedUser = { ...user, resumeUploaded: true };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      navigate("/user/home");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slide-up space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Upload your resume</h1>
        <p className="text-muted-foreground">PDF or DOCX supported</p>
      </div>

      {/* ✅ FIX: Show status if resume exists */}
      {user?.resumeUploaded && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5" />
            <p>You already have a resume uploaded. Uploading a new one will replace it.</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <FileUpload onFileSelect={handleFileSelect} />

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/user/dashboard/profile")} className="flex-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleComplete} className="flex-1" disabled={(!file && !user?.resumeUploaded) || loading}>
          {loading ? "Uploading..." : (file ? "Upload & Finish" : "Finish")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserDashboardResume;