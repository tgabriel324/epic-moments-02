import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { CreateStampDialog } from "@/components/business/CreateStampDialog";
import { CreateVideoDialog } from "@/components/business/CreateVideoDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stamps } from "@/pages/business/Stamps";
import { Videos } from "@/pages/business/Videos";

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

        <div className="flex items-center justify-end space-x-4">
          <CreateStampDialog />
          <CreateVideoDialog />
        </div>

        <Tabs defaultValue="stamps" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="stamps">Estampas</TabsTrigger>
            <TabsTrigger value="videos">Vídeos</TabsTrigger>
          </TabsList>
          <TabsContent value="stamps" className="mt-6">
            <Stamps />
          </TabsContent>
          <TabsContent value="videos" className="mt-6">
            <Videos />
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  );
}