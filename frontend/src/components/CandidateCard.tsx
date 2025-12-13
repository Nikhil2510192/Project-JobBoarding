import { MapPin, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CandidateCardProps {
  name: string;
  age: number;
  location: string;
  experience: string;
  skills: string[];
  onViewProfile?: () => void;
  onViewResume?: () => void;
  onShortlist?: () => void;
  onReject?: () => void;
  status?: "pending" | "shortlisted" | "rejected";
}

export const CandidateCard = ({
  name,
  age,
  location,
  experience,
  skills,
  onViewProfile,
  onViewResume,
  onShortlist,
  onReject,
  status = "pending",
}: CandidateCardProps) => {
  return (
    <div className="p-5 rounded-xl border border-border hover:border-foreground transition-all">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-primary-foreground">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {age} years old
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {experience} exp
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" onClick={onViewProfile}>
          View Profile
        </Button>
        <Button variant="secondary" size="sm" onClick={onViewResume}>
          View Resume
        </Button>
        {status === "pending" && (
          <>
            <Button variant="success" size="sm" onClick={onShortlist}>
              Shortlist
            </Button>
            <Button variant="destructive" size="sm" onClick={onReject}>
              Reject
            </Button>
          </>
        )}
        {status === "shortlisted" && (
          <span className="ml-auto rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            Shortlisted
          </span>
        )}
        {status === "rejected" && (
          <span className="ml-auto rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            Rejected
          </span>
        )}
      </div>
    </div>
  );
};
