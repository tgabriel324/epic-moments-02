
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
import { Tables } from "@/integrations/supabase/types";

type Stamp = Tables<"stamps">;

interface StampSelectProps {
  onSelect: (stampIds: string[]) => void;
  selectedIds: string[];
  className?: string;
}

export function StampSelect({ onSelect, selectedIds, className }: StampSelectProps) {
  const [open, setOpen] = useState(false);

  const { data: stamps, isLoading } = useQuery({
    queryKey: ['stamps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stamps')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Stamp[];
    },
  });

  const toggleStamp = (stampId: string) => {
    const newSelection = selectedIds.includes(stampId)
      ? selectedIds.filter(id => id !== stampId)
      : [...selectedIds, stampId];
    onSelect(newSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedIds.length 
            ? `${selectedIds.length} estampa${selectedIds.length === 1 ? '' : 's'} selecionada${selectedIds.length === 1 ? '' : 's'}`
            : "Selecionar estampas..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar estampa..." />
          <CommandEmpty>Nenhuma estampa encontrada.</CommandEmpty>
          <CommandGroup>
            {stamps?.map((stamp) => (
              <CommandItem
                key={stamp.id}
                value={stamp.name}
                onSelect={() => toggleStamp(stamp.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedIds.includes(stamp.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {stamp.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
