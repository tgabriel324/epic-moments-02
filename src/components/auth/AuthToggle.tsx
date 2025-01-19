import { Button } from "@/components/ui/button";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: (isLogin: boolean) => void;
}

export const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <div className="flex gap-2 justify-center">
      <Button
        type="button"
        variant={isLogin ? "default" : "outline"}
        className={`flex-1 ${
          isLogin 
            ? 'bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white' 
            : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10'
        }`}
        onClick={() => onToggle(true)}
      >
        Login
      </Button>
      <Button
        type="button"
        variant={!isLogin ? "default" : "outline"}
        className={`flex-1 ${
          !isLogin 
            ? 'bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white' 
            : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10'
        }`}
        onClick={() => onToggle(false)}
      >
        Cadastro
      </Button>
    </div>
  );
};