import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Briefcase, Users, Eye, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type Job = {
  id: number;
  title: string;
  salary: string;
  description: string;
  applicants: number;
  posted: string;
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    salary: "",
    description: "",
    skills: "",
    openings: "",
    experience: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing company jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual "list company jobs" endpoint
        const res = await fetch(`${API_BASE_URL}/company/jobs`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to load jobs");

        const mapped: Job[] = (data.jobs || data || []).map((j: any) => ({
          id: j.id,
          title: j.role || j.title,
          salary: j.salary ? `₹${j.salary}` : "Not specified",
          description: j.description || "",
          applicants: j.applicantsCount || 0,
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

  // Stats computed from jobs
  const stats = useMemo(() => {
    const activeJobs = jobs.length;
    const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicants || 0), 0);
    const avgSalaryNumber =
      jobs.length > 0
        ? Math.round(
            jobs.reduce((sum, j) => {
              const match = j.salary.match(/\d+/g);
              const num = match ? Number(match.join("")) : 0;
              return sum + num;
            }, 0) / jobs.length
          )
        : 0;

    return [
      { label: "Active Jobs", value: String(activeJobs), icon: Briefcase },
      { label: "Total Applicants", value: String(totalApplicants), icon: Users },
      { label: "Profile Views", value: "0", icon: Eye }, // hook to analytics later
      {
        label: "Avg. Salary",
        value: avgSalaryNumber ? `₹${avgSalaryNumber}` : "N/A",
        icon: DollarSign,
      },
    ];
  }, [jobs]);

  const handlePostJob = async () => {
    if (
      !newJob.title ||
      !newJob.salary ||
      !newJob.description ||
      !newJob.skills ||
      !newJob.openings ||
      !newJob.experience ||
      !newJob.deadline
    ) {
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/job/createJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          job_id: Date.now(), // or a real external id
          salary: Number(newJob.salary),
          role: newJob.title,
          skills: newJob.skills.split(",").map((s) => s.trim()),
          number: Number(newJob.openings),
          experience: Number(newJob.experience),
          deadLine: newJob.deadline,
          description: newJob.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create job");

      const created = data.job;

      const mappedJob: Job = {
        id: created.id,
        title: created.role,
        salary: created.salary ? `₹${created.salary}` : newJob.salary,
        description: created.description || newJob.description,
        applicants: 0,
        posted: created.deadLine
          ? `Closes on ${new Date(created.deadLine).toLocaleDateString()}`
          : "Just now",
      };

      setJobs((prev) => [mappedJob, ...prev]);
      setNewJob({
        title: "",
        salary: "",
        description: "",
        skills: "",
        openings: "",
        experience: "",
        deadline: "",
      });
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while posting job");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Company Dashboard</p>
          <h1 className="text-4xl font-bold text-foreground">Your Company</h1>
          <p className="text-muted-foreground mt-2">
            Manage your jobs and applicants
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Post Job Form */}
      {showForm && (
        <div className="rounded-xl border border-foreground p-6 animate-slide-up">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Post a New Job
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Title
                </label>
                <Input
                  value={newJob.title}
                  onChange={(e) =>
                    setNewJob({ ...newJob, title: e.target.value })
                  }
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Salary (per year)
                </label>
                <Input
                  type="number"
                  value={newJob.salary}
                  onChange={(e) =>
                    setNewJob({ ...newJob, salary: e.target.value })
                  }
                  placeholder="e.g., 1400000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Skills
                </label>
                <Input
                  value={newJob.skills}
                  onChange={(e) =>
                    setNewJob({ ...newJob, skills: e.target.value })
                  }
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Openings
                </label>
                <Input
                  type="number"
                  value={newJob.openings}
                  onChange={(e) =>
                    setNewJob({ ...newJob, openings: e.target.value })
                  }
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Min. Experience (years)
                </label>
                <Input
                  type="number"
                  value={newJob.experience}
                  onChange={(e) =>
                    setNewJob({ ...newJob, experience: e.target.value })
                  }
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Application Deadline
                </label>
                <Input
                  type="date"
                  value={newJob.deadline}
                  onChange={(e) =>
                    setNewJob({ ...newJob, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Job Description
              </label>
              <textarea
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                placeholder="Describe the role, responsibilities, and requirements..."
                className="flex min-h-[120px] w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePostJob}
                disabled={
                  posting ||
                  !newJob.title ||
                  !newJob.salary ||
                  !newJob.description ||
                  !newJob.skills ||
                  !newJob.openings ||
                  !newJob.experience ||
                  !newJob.deadline
                }
              >
                {posting ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Posted Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Posted Jobs</h2>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-5 rounded-xl border border-border hover:border-foreground transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {job.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-success font-medium">
                      {job.salary}
                    </span>
                    <span className="text-muted-foreground">
                      {job.applicants} applicants
                    </span>
                    <span className="text-muted-foreground">
                      {job.posted}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/company/job/${job.id}`)}
                >
                  View Details
                </Button>
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
    </div>
  );
};

export default CompanyDashboard;
