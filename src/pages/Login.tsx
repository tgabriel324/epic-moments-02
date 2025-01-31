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
    setIsLoading(true);
    console.log("Iniciando processo de autenticação:", isLogin ? "login" : "registro");

    try {
      if (isLogin) {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          console.error("Erro ao fazer login:", error);
          if (error.message === "Invalid login credentials") {
            toast.error("Email ou senha incorretos");
          } else {
            toast.error("Erro ao fazer login. Tente novamente.");
          }
          return;
        }

        // Buscar o perfil do usuário para verificar o tipo
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user?.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          toast.error("Erro ao verificar tipo de usuário");
          return;
        }

        toast.success("Login realizado com sucesso!");
        
        // Redirecionar baseado no tipo de usuário
        switch (profile?.user_type) {
          case 'admin':
            navigate("/admin/dashboard");
            break;
          case 'business_owner':
            navigate("/business/dashboard");
            break;
          case 'end_user':
            navigate("/user/dashboard");
            break;
          default:
            navigate("/user/dashboard");
        }
      } else {
        // Verificar se o usuário já existe antes de tentar registrar
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', values.email)
          .single();

        if (existingUser) {
          toast.error("Este email já está cadastrado. Faça login.");
          setIsLogin(true);
          return;
        }

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
          if (error.message === "User already registered") {
            toast.error("Este email já está cadastrado. Faça login.");
            setIsLogin(true);
          } else {
            toast.error("Erro ao criar conta. Tente novamente.");
          }
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