import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/CandidateCard";
import { a } from "node_modules/framer-motion/dist/types.d-DagZKalS";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type Candidate = {
  id: number;
  name: string;
  age?: number;
  location?: string;
  experience?: string;
  skills: string[];
  appliedFor: string;
  status: "applied" | "shortlisted";
};

type CompanyCandidatesProps = {
  jobId: number; // which job's candidates to load
};

const CompanyCandidates = ({ jobId }: CompanyCandidatesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load applied + shortlisted users for this job
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      try {
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

        // Map backend shape into Candidate[]
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
            appliedFor: "This position",
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
          experience: u.experience ? `${u.experience} years` : "Not specified",
          skills: Array.isArray(u.skills)
            ? u.skills
            : typeof u.skills === "string"
            ? u.skills.split(",").map((s: string) => s.trim())
            : [],
          appliedFor: "This position",
          status: "shortlisted",
        }));

        setCandidates([...applied, ...shortlisted]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchCandidates();
  }, [jobId]);

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleShortlist = async (userId: number) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/job/shortlistUserForJob/${jobId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to shortlist");

      // Update status locally
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === userId ? { ...c, status: "shortlisted" } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (userId: number) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/job/rejectAppliedUser/${jobId}?userId=${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reject");

      setCandidates((prev) => prev.filter((c) => c.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold text-foreground">All Candidates</h1>
        <p className="text-muted-foreground mt-2">
          Browse all candidates for this job posting
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name or skills..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading candidates...</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {filteredCandidates.length}
        </span>{" "}
        candidates
      </p>

      {/* Candidates List */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id}>
            <p className="text-xs text-muted-foreground mb-2">
              Applied for:{" "}
              <span className="font-medium text-foreground">
                {candidate.appliedFor}
              </span>{" "}
              {candidate.status === "shortlisted" && (
                <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  Shortlisted
                </span>
              )}
            </p>
            <CandidateCard
              name={candidate.name}
              age={candidate.age}
              location={candidate.location}
              experience={candidate.experience}
              skills={candidate.skills}
              onViewProfile={() => {
                // later: navigate to candidate profile page
              }}
              onViewResume={() => {
                // later: open resume viewer
              }}
              onShortlist={() => handleShortlist(candidate.id)}
              onReject={() => handleReject(candidate.id)}
            />
          </div>
        ))}

        {!loading && filteredCandidates.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No candidates found for this job yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanyCandidates;
