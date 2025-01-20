import { ARViewSettings } from "@/types/ar";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorScreenProps {
  settings: ARViewSettings;
  error: string;
}

export const ErrorScreen = ({ settings, error }: ErrorScreenProps) => {
  return (
    <div 
      className="flex min-h-screen items-center justify-center p-4" 
      style={{
        backgroundColor: settings.background_color
      }}
    >
      <div className="text-center max-w-md w-full">
        <div className="bg-destructive/10 rounded-lg p-6 mb-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium text-lg mb-2">
            {error}
          </p>
          <p className="text-muted-foreground text-sm">
            Verifique se o link está correto ou se a estampa ainda está disponível
          </p>
        </div>
        
        <Button
          onClick={() => window.location.reload()}
          className="w-full"
          style={{
            backgroundColor: settings.landing_page_primary_color,
          }}
        >
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
};