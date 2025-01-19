import { Sparkles } from "lucide-react";

export const AuthHeader = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-2">
        <Sparkles className="w-8 h-8 text-[#00BFFF]" />
        <h1 className="text-4xl font-bold text-[#000000]">
          Epic Moments
        </h1>
      </div>
      <p className="text-lg text-[#333333]">
        Transforme suas estampas em experiências mágicas com Realidade Aumentada
      </p>
    </div>
  );
};