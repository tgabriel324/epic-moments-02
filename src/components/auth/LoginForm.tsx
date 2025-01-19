import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthHeader } from "./AuthHeader";
import { AuthToggle } from "./AuthToggle";
import { AuthForm } from "./AuthForm";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  userType: z.enum(["business_owner", "end_user"]).optional(),
});

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log(isLogin ? "Tentando login com:" : "Tentando cadastro com:", values);
      
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error("Erro no login:", error);
          toast.error(
            error.message === "Invalid login credentials"
              ? "Email ou senha inválidos"
              : "Erro ao fazer login. Tente novamente."
          );
          return;
        }

        console.log("Login bem sucedido!");
        toast.success("Login realizado com sucesso!");
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
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
          toast.error("Erro ao realizar cadastro. Tente novamente.");
          return;
        }

        console.log("Cadastro realizado!");
        toast.success("Cadastro realizado com sucesso! Verifique seu email.");
      }

      navigate("/");
      
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error(`Erro inesperado ao ${isLogin ? 'fazer login' : 'realizar cadastro'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const email = prompt("Digite seu email para recuperar a senha:");
    if (!email) return;

    try {
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

        <div className="text-center">
          <Button 
            variant="link" 
            className="text-sm text-[#00BFFF] hover:text-[#00BFFF]/80 transition-colors duration-200"
            onClick={handleResetPassword}
          >
            Esqueceu sua senha?
          </Button>
        </div>
      </div>
    </div>
  );
};