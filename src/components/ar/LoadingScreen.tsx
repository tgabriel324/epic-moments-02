import { ARViewSettings } from "@/types/ar";

interface LoadingScreenProps {
  settings: ARViewSettings;
}

export const LoadingScreen = ({ settings }: LoadingScreenProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{
      backgroundColor: settings.background_color
    }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{
          borderColor: settings.landing_page_primary_color
        }}></div>
        <p className="mt-4" style={{
          color: settings.landing_page_primary_color
        }}>
          {settings.landing_page_title}
        </p>
      </div>
    </div>
  );
};