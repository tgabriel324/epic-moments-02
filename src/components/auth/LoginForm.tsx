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
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">{isLogin ? "Login" : "Cadastro"}</h1>
        <p className="text-gray-500">
          {isLogin 
            ? "Entre com sua conta para continuar" 
            : "Crie sua conta para começar"}
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          variant={isLogin ? "default" : "outline"}
          className={`flex-1 ${isLogin ? 'bg-[#00BFFF] hover:bg-[#00BFFF]/90' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </Button>
        <Button
          type="button"
          variant={!isLogin ? "default" : "outline"}
          className={`flex-1 ${!isLogin ? 'bg-[#00BFFF] hover:bg-[#00BFFF]/90' : ''}`}
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
                  <Input placeholder="seu@email.com" {...field} />
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
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/90"
            disabled={isLoading}
          >
            {isLoading 
              ? (isLogin ? "Entrando..." : "Cadastrando...") 
              : (isLogin ? "Entrar" : "Cadastrar")}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Button variant="link" className="text-sm text-[#00BFFF]">
          Esqueceu sua senha?
        </Button>
      </div>
    </div>
  );
};