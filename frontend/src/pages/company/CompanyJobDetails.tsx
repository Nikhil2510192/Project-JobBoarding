import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/CandidateCard";
import { cn } from "@/lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type Tab = "recommended" | "applied" | "shortlisted";

type Candidate = {
  id: number;
  name: string;
  age?: number;
  location?: string;
  experience?: string;
  skills: string[];
  status: Tab;
};

type JobInfo = {
  id: number;
  title: string;
  salary?: string;
  description?: string;
};

const CompanyJobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("applied");
  const [job, setJob] = useState<JobInfo | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load job details + candidates
  useEffect(() => {
    if (!jobId || Number.isNaN(jobId)) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Job details (replace endpoint with your actual job fetch route)
        const jobRes = await fetch(`${API_BASE_URL}/company/job/${jobId}`, {
          credentials: "include",
        });
        const jobData = await jobRes.json();
        if (!jobRes.ok) throw new Error(jobData.message || "Failed to load job");

        const jobInfo: JobInfo = {
          id: jobData.job?.id ?? jobId,
          title: jobData.job?.role || jobData.job?.title || "Job details",
          salary: jobData.job?.salary
            ? `₹${jobData.job.salary}`
            : "Not specified",
          description: jobData.job?.description || "",
        };
        setJob(jobInfo);

        // 2) Applied + shortlisted users
        const [appliedRes, shortlistedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/job/getAppliedUsers/${jobId}`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/job/getShortlistedUsers/${jobId}`, {
            credentials: "include",
          }),
        ]);

        const appliedData = await appliedRes.json();
        const shortlistedData = await shortlistedRes.json();

        if (!appliedRes.ok || !shortlistedRes.ok) {
          throw new Error(
            appliedData.message ||
              shortlistedData.message ||
              "Failed to load candidates"
          );
        }

        const applied: Candidate[] = (appliedData.appliedUsers || []).map(
          (u: any) => ({
            id: u.id,
            name: u.name || u.email,
            age: undefined,
            location: u.location || "Not specified",
            experience: u.experience
              ? `${u.experience} years`
              : "Not specified",
            skills: Array.isArray(u.skills)
              ? u.skills
              : typeof u.skills === "string"
              ? u.skills.split(",").map((s: string) => s.trim())
              : [],
            status: "applied",
          })
        );

const shortlisted: Candidate[] = (
  shortlistedData.shortlistedUsers || []
).map((u: any) => ({
  id: u.id,
  name: u.name || u.email,
  age: undefined,
  location: u.location || "Not specified",
  experience: u.experience
    ? `${u.experience} years`
    : "Not specified",
  skills: Array.isArray(u.skills)
    ? u.skills
    : typeof u.skills === "string"
    ? u.skills.split(",").map((s: string) => s.trim())
    : [],
  status: "shortlisted",
}));

        // For now, "recommended" is empty; later you can plug in an AI endpoint.
        setCandidates([...applied, ...shortlisted]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleShortlist = async (candidateId: number) => {
    if (!jobId) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/job/shortlistUserForJob/${jobId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId: candidateId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to shortlist");

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, status: "shortlisted" } : c
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (candidateId: number) => {
    if (!jobId) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/job/rejectAppliedUser/${jobId}?userId=${candidateId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reject");

      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const counts = useMemo(
    () => ({
      recommended: candidates.filter((c) => c.status === "recommended").length,
      applied: candidates.filter((c) => c.status === "applied").length,
      shortlisted: candidates.filter((c) => c.status === "shortlisted").length,
    }),
    [candidates]
  );

  const filteredCandidates = candidates.filter((c) => {
    if (activeTab === "shortlisted") return c.status === "shortlisted";
    if (activeTab === "applied") return c.status === "applied";
    return c.status === "recommended";
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: "recommended", label: "Recommended" },
    { key: "applied", label: "Applied" },
    { key: "shortlisted", label: "Shortlisted" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/company/dashboard")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-foreground">
          {job?.title || "Job details"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {job?.salary || "Salary not specified"} •{" "}
          {candidates.length} total candidates
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all",
              activeTab === tab.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                activeTab === tab.key
                  ? "bg-foreground text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Candidates */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading candidates...
          </p>
        ) : (
          filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              name={candidate.name}
              age={candidate.age}
              location={candidate.location}
              experience={candidate.experience}
              skills={candidate.skills}
              status={
                candidate.status === "shortlisted" ? "shortlisted" : "pending"
              }
              onViewProfile={() => {
                // add navigation to candidate profile if you build it
              }}
              onViewResume={() => {
                // open resume viewer when implemented
              }}
              onShortlist={() => handleShortlist(candidate.id)}
              onReject={() => handleReject(candidate.id)}
              disabled={actionLoading}
            />
          ))
        )}
      </div>

      {/* Empty State */}
      {!loading && filteredCandidates.length === 0 && (
        <div className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No candidates in this category
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeTab === "shortlisted"
              ? "Shortlist candidates to see them here"
              : "Check other tabs for more candidates"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyJobDetails;
