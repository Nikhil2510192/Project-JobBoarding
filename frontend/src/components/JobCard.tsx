import { MapPin, DollarSign, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  posted?: string;
  onView?: () => void;
  onApply?: () => void;
  applied?: boolean;
}

export const JobCard = ({
  title,
  company,
  location,
  salary,
  type,
  posted,
  onView,
  onApply,
  applied = false,
}: JobCardProps) => {
  return (
    <div className="group p-5 rounded-xl border border-border hover:border-foreground transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {company}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
            {salary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-success">
                <DollarSign className="h-3 w-3" />
                {salary}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">
              <Clock className="h-3 w-3" />
              {type}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          {!applied && onView && (
            <Button variant="outline" size="sm" onClick={onView}>
              View
            </Button>
          )}
          {applied ? (
            <Button variant="secondary" size="sm" disabled>
              Applied
            </Button>
          ) : (
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          )}
        </div>
      </div>
      {posted && (
        <p className="mt-3 text-xs text-muted-foreground">Posted {posted}</p>
      )}
    </div>
  );
};
