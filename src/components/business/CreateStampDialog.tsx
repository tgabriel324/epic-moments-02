import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function CreateStampDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast({
        title: "Imagem obrigatória",
        description: "Por favor, selecione uma imagem para a estampa",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar uma estampa",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const fileExt = image.name.split(".").pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("stamps")
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("stamps")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("stamps")
        .insert({
          name,
          description,
          image_url: publicUrl,
          business_id: user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Estampa criada",
        description: "Sua estampa foi criada com sucesso!",
      });

      setIsOpen(false);
      setName("");
      setDescription("");
      setImage(null);
    } catch (error) {
      console.error("Erro ao criar estampa:", error);
      toast({
        title: "Erro ao criar estampa",
        description: "Ocorreu um erro ao criar sua estampa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white shadow-lg shadow-[#00BFFF]/20 transition-all hover:shadow-[#00BFFF]/40">
          <ImagePlus className="mr-2 h-4 w-4" />
          Nova Estampa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Estampa</DialogTitle>
            <DialogDescription>
              Adicione uma nova estampa para conectar com vídeos em AR
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="name"
                placeholder="Nome da estampa"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Textarea
                id="description"
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#00BFFF] hover:bg-[#00BFFF]/90"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Estampa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}