import { useEffect, useMemo, useState } from "react";
import { Briefcase, Eye, Gift, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  posted?: string;
  applied?: boolean;
  status?: string;
};

type Stat = { label: string; value: string; icon: React.ComponentType<any> };

type UserSummary = {
  name: string;
  role?: string;
  location?: string;
};

const UserHome = () => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [jobOffers, setJobOffers] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) User profile
        const userRes = await fetch(`${API_BASE_URL}/user/getUser`, {
          credentials: "include",
        });

        const userData = await userRes.json();
        if (!userRes.ok) {
          throw new Error(userData.message || "Failed to load user profile");
        }
        setUser({
          name: userData.user?.name || "User",
          role: userData.user?.role,
          location: userData.user?.location,
        });

        // 2) Applied jobs (statuses)
        const jobsRes = await fetch(`${API_BASE_URL}/job/applied-jobs`, {
          credentials: "include",
        });
        const jobsData = await jobsRes.json();
        if (!jobsRes.ok) {
          throw new Error(jobsData.message || "Failed to load jobs");
        }

        const allJobs: Job[] = (jobsData.jobs || jobsData || []).map(
          (job: any) => {
            const status = job.status || job.applicationStatus;
            return {
              id: job.id,
              title: job.role || job.title || "Job title",
              company: job.companyName || job.company || "Company",
              location: job.location || "Not specified",
              salary: job.salary ? `₹${job.salary}` : undefined,
              type: job.type || "Full-time",
              posted: job.deadLine
                ? `Deadline: ${new Date(job.deadLine).toLocaleDateString()}`
                : undefined,
              applied: true,
              status,
            };
          }
        );

        setAppliedJobs(allJobs);

        // 3) Offers = subset of jobs by status
        const offers = allJobs.filter((j) =>
          ["shortlisted", "offer", "selected"].includes(
            (j.status || "").toLowerCase()
          )
        );
        setJobOffers(offers);

        // 4) Stats derived from jobs
        const applicationsCount = allJobs.length;
        const offersCount = offers.length;
        const interviewsCount = allJobs.filter((j) =>
          ["interview", "in process"].includes((j.status || "").toLowerCase())
        ).length;
        const viewsCount = 0; // plug into analytics later

        setStats([
          {
            label: "Applications",
            value: String(applicationsCount),
            icon: Send,
          },
          {
            label: "Profile Views",
            value: String(viewsCount),
            icon: Eye,
          },
          {
            label: "Interviews",
            value: String(interviewsCount),
            icon: Briefcase,
          },
          { label: "Offers", value: String(offersCount), icon: Gift },
        ]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const updatesCount = useMemo(() => jobOffers.length, [jobOffers]);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Welcome back,</p>
          <h1 className="text-4xl font-bold text-foreground">
            {user?.name || "User"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.role || "Job seeker"}
            {user?.location ? ` • ${user.location}` : ""}
          </p>
        </div>
        <Button>{updatesCount} new updates</Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {loading && (
        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      )}

      {/* Stats Grid */}
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

      {/* Applied Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Applied Jobs
          </h2>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {appliedJobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              type={job.type}
              posted={job.posted}
              applied={job.applied}
            />
          ))}

          {!loading && appliedJobs.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You have not applied to any jobs yet.
            </p>
          )}
        </div>
      </div>

      {/* Job Offers */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              Job Offers
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              {jobOffers.length} new
            </span>
          </div>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </div>
        <div className="space-y-4">
          {jobOffers.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              company={job.company}
              location={job.location}
              salary={job.salary}
              type={job.type}
              posted={job.posted}
              onApply={() => {
                // maybe open details or accept/decline later
              }}
            />
          ))}

          {!loading && jobOffers.length === 0 && (
            <p className="text-sm text-muted-foreground">
              You do not have any offers yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHome;
