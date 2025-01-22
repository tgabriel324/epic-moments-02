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
        
        // Verificar status de confirmação do email
        if (session?.user && !session.user.email_confirmed_at) {
          toast.warning("Por favor, confirme seu email para acesso completo");
        }
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

      // Mostrar mensagens relevantes baseadas no evento
      switch (event) {
        case 'SIGNED_IN':
          if (!session?.user.email_confirmed_at) {
            toast.warning("Por favor, confirme seu email para acesso completo");
          } else {
            toast.success("Login realizado com sucesso!");
          }
          break;
        case 'SIGNED_OUT':
          toast.success("Logout realizado com sucesso");
          break;
        case 'USER_UPDATED':
          toast.success("Perfil atualizado com sucesso");
          break;
      }
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

  const resendConfirmationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email
      });

      if (error) {
        console.error("Erro ao reenviar email:", error);
        toast.error("Erro ao reenviar email de confirmação");
        return;
      }

      toast.success("Email de confirmação reenviado com sucesso!");
    } catch (error) {
      console.error("Erro inesperado ao reenviar email:", error);
      toast.error("Erro inesperado ao reenviar email");
    }
  };

  return {
    user,
    loading,
    signOut,
    resendConfirmationEmail,
    isEmailConfirmed: user?.email_confirmed_at ? true : false
  };
}