import { BusinessLayout } from "@/components/layouts/BusinessLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wand2, QrCode, Video, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function AR() {
  const features = [
    {
      title: "Estampas",
      description: "Gerencie suas estampas para experiências em AR",
      icon: ImageIcon,
      href: "/business/stamps"
    },
    {
      title: "Vídeos",
      description: "Faça upload e gerencie seus vídeos em AR",
      icon: Video,
      href: "/business/videos"
    },
    {
      title: "QR Codes",
      description: "Gere e personalize QR codes para suas experiências",
      icon: QrCode,
      href: "/business/qrcodes"
    }
  ];

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
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <Link to={feature.href}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
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
            <Button variant="outline">
              Testar Experiência
            </Button>
          </CardContent>
        </Card>
      </div>
    </BusinessLayout>
  );
}