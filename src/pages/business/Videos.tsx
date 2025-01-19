import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Search, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateVideoDialog } from "@/components/business/CreateVideoDialog";

export default function Videos() {
  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Vídeos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus vídeos para conectar com estampas em AR
            </p>
          </div>
          <CreateVideoDialog />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar vídeos..."
            className="pl-10 bg-card border-muted/30 focus-visible:ring-primary/30"
          />
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted/50 bg-card/50 p-12 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Nenhum vídeo</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Comece adicionando seu primeiro vídeo para conectar com estampas em AR
          </p>
          <CreateVideoDialog />
        </div>
      </div>
    </BusinessLayout>
  );
}