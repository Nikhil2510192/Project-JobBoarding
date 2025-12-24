import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, DollarSign, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type Job = {
  id: number;
  title: string;
  salary: string;
  type: string;
  applicants: number;
  shortlisted: number;
  posted: string;
};

const CompanyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your real company job listing endpoint
        const res = await fetch(`${API_BASE_URL}/company/jobs`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load jobs");
        }

        const mapped: Job[] = (data.jobs || data || []).map((j: any) => ({
          id: j.id,
          title: j.role || j.title || "Job title",
          salary: j.salary ? `₹${j.salary}` : "Not specified",
          type: j.type || "Full-time",
          applicants: j._count?.usersApplied ?? j.applicantsCount ?? 0,
          shortlisted: j._count?.usersShortlisted ?? j.shortlistedCount ?? 0,
          posted: j.deadLine
            ? `Closes on ${new Date(j.deadLine).toLocaleDateString()}`
            : "Not specified",
        }));

        setJobs(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Posted Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Manage your job listings
          </p>
        </div>
        <Button onClick={() => navigate("/company/dashboard")}>
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading jobs...</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-xl border border-border hover:border-foreground transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-foreground">
                      {job.title}
                    </h3>
                    <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-success font-medium">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {job.applicants}
                    </p>
                    <p className="text-xs text-muted-foreground">Applicants</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">
                      {job.shortlisted}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Shortlisted
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/company/job/${job.id}`)}
                  >
                    View Candidates
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {!jobs.length && (
            <p className="text-sm text-muted-foreground">
              You have not posted any jobs yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
