import { UserLayout } from "@/components/layouts/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar } from "lucide-react";

export default function History() {
  // Dados de exemplo - em uma implementação real, viriam do backend
  const historyItems = [
    {
      id: 1,
      stampName: "Camiseta Verão 2024",
      date: "2024-03-20",
      time: "14:30",
      duration: "45s",
    },
    {
      id: 2,
      stampName: "Moletom Inverno",
      date: "2024-03-19",
      time: "16:15",
      duration: "30s",
    },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
          <p className="text-muted-foreground">
            Suas interações recentes com experiências AR
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4">
            {historyItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">
                    {item.stampName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-[#00BFFF]" />
                      {item.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-[#00BFFF]" />
                      {item.time}
                    </div>
                    <div className="text-[#00BFFF]">Duração: {item.duration}</div>
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