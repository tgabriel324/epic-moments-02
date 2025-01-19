import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-8 h-8 text-[#00BFFF]" />
          <h1 className="text-4xl font-bold text-[#000000]">
            Epic Moments
          </h1>
        </div>
        <p className="text-lg text-[#333333]">
          Transforme suas estampas em experiências mágicas com Realidade Aumentada
        </p>
      </div>

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

        <div className="flex gap-2 justify-center">
          <Button
            type="button"
            variant={isLogin ? "default" : "outline"}
            className={`flex-1 ${
              isLogin 
                ? 'bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white' 
                : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </Button>
          <Button
            type="button"
            variant={!isLogin ? "default" : "outline"}
            className={`flex-1 ${
              !isLogin 
                ? 'bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white' 
                : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Cadastro
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333]">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      {...field}
                      className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] text-[#000000]" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#333333]">Senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••" 
                      {...field}
                      className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] text-[#000000]" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading 
                ? (isLogin ? "Entrando..." : "Cadastrando...") 
                : (isLogin ? "Entrar" : "Cadastrar")}
            </Button>
          </form>
        </Form>

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