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
});

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log(isLogin ? "Tentando login com:" : "Tentando cadastro com:", values);
      
      const { error } = isLogin 
        ? await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          })
        : await supabase.auth.signUp({
            email: values.email,
            password: values.password,
          });

      if (error) {
        console.error(isLogin ? "Erro no login:" : "Erro no cadastro:", error);
        toast.error(
          error.message === "Invalid login credentials"
            ? "Email ou senha inválidos"
            : `Erro ao ${isLogin ? 'fazer login' : 'realizar cadastro'}. Tente novamente.`
        );
        return;
      }

      console.log(isLogin ? "Login bem sucedido!" : "Cadastro realizado!");
      toast.success(isLogin ? "Login realizado com sucesso!" : "Cadastro realizado com sucesso!");
      navigate("/");
      
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error(`Erro inesperado ao ${isLogin ? 'fazer login' : 'realizar cadastro'}`);
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
          >
            Esqueceu sua senha?
          </Button>
        </div>
      </div>
    </div>
  );
};