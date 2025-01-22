import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StampsGrid } from "@/components/business/StampsGrid";
import Videos from "@/pages/business/Videos";

export default function Media() {
  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Mídia
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas estampas e vídeos em AR
          </p>
        </div>

        <Tabs defaultValue="stamps" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="stamps">Estampas</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
          </TabsList>
          <TabsContent value="stamps" className="mt-6">
            <StampsGrid />
          </TabsContent>
          <TabsContent value="videos" className="mt-6">
            <Videos />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}