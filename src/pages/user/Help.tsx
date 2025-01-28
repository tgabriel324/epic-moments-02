import { UserLayout } from "@/components/layouts/UserLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function Help() {
  const faqItems = [
    {
      question: "Como funciona a experiência AR?",
      answer:
        "Nossa tecnologia permite que você visualize vídeos em realidade aumentada diretamente sobre as estampas dos produtos. Basta apontar a câmera do seu dispositivo para a estampa e o vídeo será exibido automaticamente.",
    },
    {
      question: "Preciso instalar algum aplicativo?",
      answer:
        "Não! Nossa solução funciona diretamente pelo navegador do seu dispositivo, sem necessidade de instalar aplicativos adicionais.",
    },
    {
      question: "Como salvo uma experiência na minha coleção?",
      answer:
        "Durante ou após a experiência AR, você pode tocar no ícone de coração para salvar a estampa em sua coleção pessoal.",
    },
    {
      question: "Posso compartilhar as experiências?",
      answer:
        "Sim! Você pode compartilhar qualquer experiência AR com seus amigos através das redes sociais ou mensagens diretas.",
    },
  ];

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ajuda</h1>
          <p className="text-muted-foreground">
            Encontre respostas para suas dúvidas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Precisa de mais ajuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Nossa equipe está pronta para ajudar você com qualquer dúvida
                  adicional.
                </p>
                <Button className="w-full bg-[#00BFFF]">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar com Suporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}