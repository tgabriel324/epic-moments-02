import { cn } from "@/lib/utils";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Círculo externo */}
        <circle cx="100" cy="100" r="90" stroke="#00BFFF" strokeWidth="4" />
        
        {/* Símbolo central - parte superior */}
        <path
          d="M100 30 L140 90 L60 90 Z"
          fill="#00BFFF"
          stroke="#00BFFF"
          strokeWidth="2"
        />
        
        {/* Símbolo central - parte inferior */}
        <path
          d="M60 110 L140 110 L100 170 Z"
          fill="#00BFFF"
          stroke="#00BFFF"
          strokeWidth="2"
        />
        
        {/* Linha central horizontal */}
        <line
          x1="60"
          y1="100"
          x2="140"
          y2="100"
          stroke="#00BFFF"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
};