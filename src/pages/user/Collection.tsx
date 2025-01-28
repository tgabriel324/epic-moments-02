import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

export default function Collection() {
  // Dados de exemplo - em uma implementação real, viriam do backend
  const collectionItems = [
    {
      id: 1,
      name: "Camiseta Verão 2024",
      brand: "Summer Vibes",
      imageUrl: "/placeholder.svg",
      isFavorite: true,
    },
    {
      id: 2,
      name: "Moletom Inverno",
      brand: "Winter Collection",
      imageUrl: "/placeholder.svg",
      isFavorite: false,
    },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minha Coleção</h1>
          <p className="text-muted-foreground">
            Suas experiências AR favoritas
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectionItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          item.isFavorite ? "fill-[#00BFFF] text-[#00BFFF]" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {item.brand}
                    </span>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </UserLayout>
  );
}