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
          <Sparkles className="w-8 h-8 text-[#9b87f5]" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB]">
            Epic Moments
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Transforme suas estampas em experiências mágicas com Realidade Aumentada
        </p>
      </div>

      <div className="backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-xl border border-white/20 space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h2>
          <p className="text-gray-500">
            {isLogin 
              ? "Entre para continuar sua jornada" 
              : "Comece a criar momentos épicos"}
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            type="button"
            variant={isLogin ? "default" : "outline"}
            className={`flex-1 ${isLogin ? 'bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity duration-200' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </Button>
          <Button
            type="button"
            variant={!isLogin ? "default" : "outline"}
            className={`flex-1 ${!isLogin ? 'bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity duration-200' : ''}`}
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      {...field}
                      className="bg-white/50 border-white/20 focus:border-[#9b87f5]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••" 
                      {...field}
                      className="bg-white/50 border-white/20 focus:border-[#9b87f5]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] hover:opacity-90 transition-opacity duration-200"
              disabled={isLoading}
            >
              {isLoading 
                ? (isLogin ? "Entrando..." : "Cadastrando...") 
                : (isLogin ? "Entrar" : "Cadastrar")}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button variant="link" className="text-sm text-[#9b87f5] hover:text-[#1EAEDB] transition-colors duration-200">
            Esqueceu sua senha?
          </Button>
        </div>
      </div>
    </div>
  );
};