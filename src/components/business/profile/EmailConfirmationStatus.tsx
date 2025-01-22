import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

export const EmailConfirmationStatus = () => {
  const { user, isEmailConfirmed, resendConfirmationEmail } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {isEmailConfirmed ? (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle2 className="h-5 w-5" />
          <span>Email confirmado</span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-yellow-500">
            <AlertCircle className="h-5 w-5" />
            <span>Email pendente de confirmação</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resendConfirmationEmail}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reenviar email
          </Button>
        </div>
      )}
    </div>
  );
};