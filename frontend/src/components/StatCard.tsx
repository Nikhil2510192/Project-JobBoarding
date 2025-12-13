import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className,
}: StatCardProps) => {
  return (
    <div className={cn("p-5 rounded-xl border border-border", className)}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
      {trend && (
        <p
          className={cn(
            "text-xs font-medium mt-2",
            trendUp ? "text-success" : "text-destructive"
          )}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </div>
  );
};
