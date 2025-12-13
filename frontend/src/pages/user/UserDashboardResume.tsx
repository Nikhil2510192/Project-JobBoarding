import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type UploadedFileInfo = {
  file: File;
  url: string;          // Cloudinary URL or similar
  cloudinaryId: string; // public_id from Cloudinary
};

const UserDashboardResume = () => {
  const navigate = useNavigate();
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selected: UploadedFileInfo | null) => {
    setFileInfo(selected);
  };

  const handleComplete = async () => {
    if (!fileInfo) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/resume/saveResume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          resumeUrl: fileInfo.url,
          cloudinaryId: fileInfo.cloudinaryId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload resume");
      }

      // You can also store data.resumeId in state/context if needed
      navigate("/user/home");
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
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-sm font-medium text-success-foreground">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-success font-medium">Profile</span>
          </div>
          <div className="flex-1 h-px bg-success" />
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-medium text-primary-foreground">
              2
            </span>
            <span className="font-medium text-foreground">Resume</span>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Upload your resume
        </h1>
        <p className="text-muted-foreground">
          Let AI analyze your resume for personalized insights
        </p>
      </div>

      <div className="space-y-8">
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {/* FileUpload should call onFileSelect with { file, url, cloudinaryId } */}
        <FileUpload onFileSelect={handleFileSelect} />

        {fileInfo && (
          <div className="rounded-xl border border-border p-5 bg-secondary/30">
            <h4 className="font-medium text-foreground mb-3">
              What happens next?
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                AI analyzes your resume for strengths and areas to improve.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                You will get personalized job recommendations based on your skills.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                Employers can discover your profile more easily.
              </li>
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/user/dashboard/profile")}
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleComplete}
            className="flex-1"
            disabled={!fileInfo || loading}
          >
            {loading ? "Uploading..." : "Complete Setup"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardResume;
