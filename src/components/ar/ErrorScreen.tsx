import { ARViewSettings } from "@/types/ar";

interface ErrorScreenProps {
  settings: ARViewSettings;
  error: string;
}

export const ErrorScreen = ({ settings, error }: ErrorScreenProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{
      backgroundColor: settings.background_color
    }}>
      <div className="text-center px-4">
        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-lg hover:opacity-90"
          style={{
            backgroundColor: settings.landing_page_primary_color,
            color: "white"
          }}
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};