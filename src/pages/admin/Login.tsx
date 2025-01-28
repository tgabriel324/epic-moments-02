import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const AdminLogin = () => {
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
      console.log("Iniciando processo de login administrativo");

      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        console.error("Erro ao fazer login:", signInError);
        toast.error("Email ou senha inválidos");
        return;
      }

      // Verificar se o usuário é admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session?.user.id)
        .single();

      if (profileError) {
        console.error("Erro ao verificar perfil:", profileError);
        toast.error("Erro ao verificar permissões");
        return;
      }

      if (profile?.user_type !== 'admin') {
        console.error("Usuário não é admin");
        toast.error("Você não tem permissão para acessar a área administrativa");
        await supabase.auth.signOut();
        return;
      }

      toast.success("Login realizado com sucesso!");
      console.log("Login administrativo realizado com sucesso");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao processar login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center">
          <Logo className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold">Login Administrativo</h2>
          <p className="mt-2 text-muted-foreground">
            Acesse o painel administrativo
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
                      placeholder="admin@email.com"
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
    </div>
  );
};

export default AdminLogin;