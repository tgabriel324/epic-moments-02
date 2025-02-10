
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video";

interface VideoSelectProps {
  onSelect: (videoId: string | null) => void;
  selectedId?: string | null;
  className?: string;
}

export function VideoSelect({ onSelect, selectedId, className }: VideoSelectProps) {
  const [open, setOpen] = useState(false);

  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('status', 'ready')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Video[];
    },
  });

  const selectedVideo = videos?.find((video) => video.id === selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedVideo ? selectedVideo.name : "Selecionar vídeo..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar vídeo..." />
          <CommandEmpty>Nenhum vídeo encontrado.</CommandEmpty>
          <CommandGroup>
            {videos?.map((video) => (
              <CommandItem
                key={video.id}
                value={video.name}
                onSelect={() => {
                  onSelect(video.id === selectedId ? null : video.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedId === video.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {video.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
