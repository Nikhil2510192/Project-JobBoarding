import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
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
};

const filters = ["All", "Remote", "Full-time", "Hybrid", "Part-time"];

const UserDiscover = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/user/discover-jobs`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load jobs");
          return;
        }

        const mapped: Job[] = (data.jobs || []).map((job: any) => ({
          id: job.jobId,
          title: job.role,
          company: job.company?.name || "Company",
          location: "Not specified",
          salary: job.salary ? `₹${job.salary}` : undefined,
          type: "Full-time",
          posted: job.deadline
            ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}`
            : undefined,
        }));

        setJobs(mapped);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === "All" || job.type === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Discover Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Find your perfect opportunity
        </p>
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border border-border p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, companies..."
              className="pl-10"
            />
          </div>
          <div className="relative md:w-48">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Location" className="pl-10" />
          </div>
          <Button>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeFilter === filter
                  ? "bg-foreground text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {filteredJobs.length}
          </span>{" "}
          jobs found
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            type={job.type}
            posted={job.posted}
            onApply={() => {}}
            onView={() => {}}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="py-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No jobs found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export default UserDiscover;
