import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <img 
        src="/lovable-uploads/31c6bdac-0fcb-4364-a187-f60477c0111a.png"
        alt="Epic Moments Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};