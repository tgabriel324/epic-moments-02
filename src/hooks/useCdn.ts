import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useCdn(url: string | undefined) {
  return useQuery({
    queryKey: ['cdn', url],
    queryFn: async () => {
      if (!url) return null;

      const { data, error } = await supabase.functions.invoke('cdn-manager', {
        body: { url },
      });

      if (error) throw error;
      return data.cdnUrl;
    },
    enabled: !!url,
  });
}