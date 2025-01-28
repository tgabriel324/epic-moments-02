import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      console.log("Iniciando processo de login");

      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error("Erro ao fazer login:", signInError);
        toast.error("Email ou senha inválidos");
        return;
      }

      if (!session) {
        console.error("Sessão não encontrada após login");
        toast.error("Erro ao processar login");
        return;
      }

      // Buscar o perfil do usuário para verificar o tipo
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error("Erro ao buscar perfil:", profileError);
        toast.error("Erro ao verificar permissões");
        return;
      }

      console.log("Tipo de usuário:", profile?.user_type);

      // Redirecionar baseado no tipo de usuário
      if (profile?.user_type === 'admin') {
        console.log("Redirecionando para dashboard admin");
        toast.success("Login administrativo realizado com sucesso!");
        navigate("/admin/dashboard");
      } else if (profile?.user_type === 'business_owner') {
        console.log("Redirecionando para dashboard business");
        toast.success("Login realizado com sucesso!");
        navigate("/business/dashboard");
      } else {
        console.log("Redirecionando para dashboard usuário");
        toast.success("Login realizado com sucesso!");
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao processar login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Login</h2>
        <p className="mt-2 text-muted-foreground">
          Entre com suas credenciais para acessar
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] focus:ring-[#00BFFF]"
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
                    {...field}
                    className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] focus:ring-[#00BFFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Link
              to="/reset-password"
              className="text-sm text-[#00BFFF] hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#00BFFF] hover:bg-[#00BFFF]/90"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};