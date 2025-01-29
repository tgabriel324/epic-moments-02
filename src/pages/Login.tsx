import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthToggle } from "@/components/auth/AuthToggle";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    console.log("Iniciando processo de autenticação:", isLogin ? "login" : "registro");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error("Erro ao fazer login:", error);
          toast.error("Email ou senha inválidos");
          return;
        }

        toast.success("Login realizado com sucesso!");
        navigate("/business/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              user_type: values.userType || "end_user",
            },
          },
        });

        if (error) {
          console.error("Erro ao criar conta:", error);
          toast.error("Erro ao criar conta");
          return;
        }

        toast.success("Conta criada com sucesso! Verifique seu email.");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />
        <div className="bg-white p-8 rounded-lg shadow-md">
          <AuthForm
            isLogin={isLogin}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;