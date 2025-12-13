import { useEffect, useState } from "react";
import { Check, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { JobCard } from "@/components/JobCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type StrengthOrImprovement = string;

type AppliedJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  posted?: string;
};

type UserInsightsProps = {
  resumeId: number; // pass this from parent or router
};

const UserInsights = ({ resumeId }: UserInsightsProps) => {
  const [resumeScore, setResumeScore] = useState<number | null>(null);
  const [strengths, setStrengths] = useState<StrengthOrImprovement[]>([]);
  const [improvements, setImprovements] = useState<StrengthOrImprovement[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Resume insights
        const resumeRes = await fetch(
          `${API_BASE_URL}/resume/analyze/${resumeId}`,
          { credentials: "include" }
        );
        const resumeData = await resumeRes.json();

        if (!resumeRes.ok) {
          throw new Error(
            resumeData.message || "Failed to load resume insights"
          );
        }

        setResumeScore(resumeData.resumeScore ?? 0);
        setStrengths(resumeData.good || []);
        setImprovements(resumeData.improve || []);

        // 2) Applied jobs
        const jobsRes = await fetch(`${API_BASE_URL}/user/applied-jobs`, {
          credentials: "include",
        });

        const jobsData = await jobsRes.json();

        if (!jobsRes.ok) {
          throw new Error(jobsData.message || "Failed to load applied jobs");
        }

        // Map backend job status data into the shape JobCard expects.
        // Adjust these field names according to your getUserJobStatuses output.
        const mappedJobs: AppliedJob[] = (jobsData.jobs || []).map(
          (job: any) => ({
            id: job.jobId,
            title: job.role,
            company: job.company?.name || "Unknown company",
            location: "Not specified",
            salary: job.salary ? `₹${job.salary}` : undefined,
            type: "Full-time",
            posted: job.deadline
              ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}`
              : undefined,
          })
        );

        setAppliedJobs(mappedJobs);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchInsights();
    }
  }, [resumeId]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading insights...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            AI Resume Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Powered by AI to help you stand out
          </p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4" />
          Update Resume
        </Button>
      </div>

      {/* Resume Score Card */}
      <div className="rounded-xl border border-border p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-foreground">
            <span className="text-3xl font-bold text-primary-foreground">
              {resumeScore ?? 0}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Resume Score</h2>
            <p className="text-muted-foreground">
              Your resume is performing well
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {resumeScore ?? 0}/100
            </span>
          </div>
          <Progress value={resumeScore ?? 0} className="h-2" />
        </div>
        <Button className="mt-6">
          <TrendingUp className="h-4 w-4" />
          View Full Report
        </Button>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <Check className="h-5 w-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {strengths.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">
              Areas to Improve
            </h3>
          </div>
          <ul className="space-y-3">
            {improvements.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Applied Jobs Section */}
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
          {appliedJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No applied jobs found yet.
            </p>
          ) : (
            appliedJobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                salary={job.salary}
                type={job.type}
                posted={job.posted}
                applied
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInsights;
