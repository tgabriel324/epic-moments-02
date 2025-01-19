import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  userType: z.enum(["business_owner", "end_user"]).optional(),
});

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

export const AuthForm = ({ isLogin, isLoading, onSubmit }: AuthFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "end_user",
    },
  });

  return (
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
                  className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] focus:ring-[#00BFFF] text-[#000000]" 
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
                  className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] focus:ring-[#00BFFF] text-[#000000]" 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {!isLogin && (
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#333333]">Tipo de Usuário</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="business_owner" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Dono de Negócio
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="end_user" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Usuário Final
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}

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
  );
};