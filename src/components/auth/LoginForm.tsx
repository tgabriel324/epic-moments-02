import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "./AuthHeader";
import { AuthToggle } from "./AuthToggle";
import { AuthForm } from "./AuthForm";
import * as z from "zod";
import { AuthError } from "@supabase/supabase-js";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  userType: z.enum(["business_owner", "end_user"]).optional(),
});

const getErrorMessage = (error: AuthError) => {
  console.log("Erro detalhado:", error);
  
  switch (error.message) {
    case "Invalid login credentials":
      return "Email ou senha inválidos";
    case "Email not confirmed":
      return "Por favor, confirme seu email antes de fazer login";
    case "User not found":
      return "Usuário não encontrado";
    case "Invalid email or password":
      return "Email ou senha inválidos";
    default:
      return "Erro ao fazer login. Tente novamente.";
  }
};

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log(isLogin ? "Tentando login com:" : "Tentando cadastro com:", values);
      
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error("Erro no login:", error);
          toast.error(getErrorMessage(error));
          return;
        }

        if (!data.user) {
          console.error("Usuário não encontrado após login");
          toast.error("Erro ao recuperar dados do usuário");
          return;
        }

        // Buscar o tipo de usuário do perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          toast.error("Erro ao carregar perfil do usuário");
          return;
        }

        console.log("Login bem sucedido! Tipo de usuário:", profile?.user_type);
        toast.success("Login realizado com sucesso!");

        // Redirecionar baseado no tipo de usuário
        if (profile?.user_type === 'business_owner') {
          navigate('/business-dashboard');
        } else if (profile?.user_type === 'end_user') {
          navigate('/user-dashboard');
        } else {
          navigate('/');
        }

      } else {
        // Verificar se as senhas coincidem
        if (values.password !== values.confirmPassword) {
          toast.error("As senhas não coincidem");
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              user_type: values.userType || "end_user",
            },
          },
        });

        if (signUpError) {
          console.error("Erro no cadastro:", signUpError);
          toast.error(getErrorMessage(signUpError));
          return;
        }

        if (data.user) {
          console.log("Cadastro realizado com sucesso!");
          toast.success("Cadastro realizado! Você já pode fazer login.");
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado ao processar sua solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const email = prompt("Digite seu email para recuperar a senha:");
      if (!email) return;

      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Erro ao enviar email de recuperação:", error);
        toast.error("Erro ao enviar email de recuperação. Tente novamente.");
        return;
      }

      toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao enviar email de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <AuthHeader />

      <div className="bg-[#F5F5F5] p-8 rounded-2xl shadow-lg border border-[#C4C4C4] space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-[#000000]">
            {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h2>
          <p className="text-[#333333]">
            {isLogin 
              ? "Entre para continuar sua jornada" 
              : "Comece a criar momentos épicos"}
          </p>
        </div>

        <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />
        <AuthForm isLogin={isLogin} isLoading={isLoading} onSubmit={onSubmit} />

        {isLogin && (
          <div className="text-center">
            <Button 
              variant="link" 
              className="text-sm text-[#00BFFF] hover:text-[#00BFFF]/80 transition-colors duration-200"
              onClick={handleResetPassword}
            >
              Esqueceu sua senha?
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};