import { useState } from "react";
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
});

export const PasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      console.log("Iniciando processo de recuperação de senha");

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Erro ao enviar email de recuperação:", error);
        toast.error("Erro ao enviar email de recuperação");
        return;
      }

      toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
      console.log("Email de recuperação enviado com sucesso");
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Recuperar Senha</h2>
        <p className="text-muted-foreground mt-2">
          Digite seu email para receber as instruções de recuperação
        </p>
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
            {isLoading ? "Enviando..." : "Enviar Email de Recuperação"}
          </Button>
        </form>
      </Form>
    </div>
  );
};