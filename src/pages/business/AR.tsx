import { useState } from "react";
import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, QrCode, Video, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ARCanvas } from "@/components/ar/ARCanvas";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function AR() {
  const [showPreview, setShowPreview] = useState(false);
  
  // Configurações de exemplo para o preview
  const previewSettings = {
    background_color: "#000000",
    landing_page_primary_color: "#00BFFF",
    landing_page_title: "Preview da Experiência AR",
    landing_page_description: "Esta é uma visualização de como sua experiência em AR aparecerá para os clientes",
    landing_page_logo_url: null
  };

  return (
    <BusinessLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Realidade Aumentada
          </h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie experiências em AR para seus produtos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/business/stamps">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Estampas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gerencie suas estampas para experiências em AR
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/business/videos">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Vídeos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Faça upload e gerencie seus vídeos em AR
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/business/qrcodes">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">QR Codes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gere e personalize QR codes para suas experiências
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              <CardTitle>Preview em AR</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription>
              Visualize como suas experiências em AR aparecerão para seus clientes
            </CardDescription>
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              Testar Experiência
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[100vw] h-[100vh] p-0 border-none bg-black">
          <ARCanvas settings={previewSettings} />
        </DialogContent>
      </Dialog>
    </BusinessLayout>
  );
}