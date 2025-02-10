
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: number | string;
  change?: number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  change, 
  description, 
  icon,
  className 
}: MetricsCardProps) {
  return (
    <Card className={cn(
      "hover:shadow-card-hover transition-shadow duration-200",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
        <CardTitle className="text-[10px] sm:text-sm font-medium text-muted-foreground truncate pr-2">
          {title}
        </CardTitle>
        {icon && <div className="text-primary shrink-0">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-sm sm:text-xl md:text-2xl font-bold truncate">
          {value}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-[8px] sm:text-xs mt-0.5 sm:mt-1">
            {change >= 0 ? (
              <ArrowUpIcon className="w-2 h-2 sm:w-4 sm:h-4 text-green-500 mr-0.5 sm:mr-1" />
            ) : (
              <ArrowDownIcon className="w-2 h-2 sm:w-4 sm:h-4 text-red-500 mr-0.5 sm:mr-1" />
            )}
            <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground ml-0.5 sm:ml-1 truncate">
              do mês anterior
            </span>
          </div>
        )}
        {description && (
          <p className="text-[8px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
