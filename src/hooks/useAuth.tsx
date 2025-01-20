import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao buscar sessão:", error);
          toast.error("Erro ao verificar autenticação");
          return;
        }

        setUser(session?.user ?? null);
        console.log("Sessão inicial carregada:", session ? "Autenticado" : "Não autenticado");
      } catch (error) {
        console.error("Erro inesperado ao buscar sessão:", error);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Mudança no estado de autenticação:", event);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log("Limpando subscription do auth state");
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
        toast.error("Erro ao fazer logout");
        return;
      }
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro inesperado ao fazer logout:", error);
      toast.error("Erro inesperado ao fazer logout");
    }
  };

  return {
    user,
    loading,
    signOut,
  };
}