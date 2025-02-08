
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthToggle } from "@/components/auth/AuthToggle";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      console.log("Iniciando processo de autenticação:", isLogin ? "login" : "registro", values);

      if (isLogin) {
        console.log("Tentando fazer login com email:", values.email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error("Erro detalhado ao fazer login:", error);
          switch (error.message) {
            case "Email not confirmed":
              toast.error("Por favor, confirme seu email antes de fazer login");
              break;
            case "Invalid login credentials":
              toast.error("Email ou senha incorretos");
              break;
            default:
              toast.error(`Erro ao fazer login: ${error.message}`);
          }
          return;
        }

        console.log("Login bem-sucedido:", data);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user?.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          toast.error("Erro ao verificar tipo de usuário");
          return;
        }

        toast.success("Login realizado com sucesso!");
        
        switch (profile?.user_type) {
          case 'admin':
            navigate("/admin/dashboard");
            break;
          case 'business_owner':
            navigate("/business/dashboard");
            break;
          default:
            navigate("/user/dashboard");
        }
      } else {
        console.log("Tentando registrar novo usuário com email:", values.email);
        
        // Removida a verificação incorreta que usava o email como UUID

        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              user_type: values.userType || "end_user",
            },
          },
        });

        if (error) {
          console.error("Erro detalhado ao criar conta:", error);
          switch (error.message) {
            case "User already registered":
              toast.error("Este email já está cadastrado. Faça login.");
              setIsLogin(true);
              break;
            case "Password should be at least 6 characters":
              toast.error("A senha deve ter no mínimo 6 caracteres");
              break;
            default:
              toast.error(`Erro ao criar conta: ${error.message}`);
          }
          return;
        }

        console.log("Registro bem-sucedido:", data);
        toast.success("Conta criada com sucesso! Verifique seu email para confirmação.");
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
        <AuthHeader />
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
