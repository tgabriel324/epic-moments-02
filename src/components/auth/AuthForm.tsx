import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { UserTypeField } from "./UserTypeField";
import { authFormSchema, type AuthFormValues } from "./AuthFormSchema";

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  onSubmit: (values: AuthFormValues) => Promise<void>;
}

export const AuthForm = ({ isLogin, isLoading, onSubmit }: AuthFormProps) => {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userType: "end_user",
    },
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <EmailField form={form} onKeyPress={handleKeyPress} />
        
        <PasswordField 
          form={form} 
          onKeyPress={handleKeyPress} 
          name="password" 
          label="Senha"
          isLogin={isLogin}
        />

        {!isLogin && (
          <>
            <PasswordField 
              form={form} 
              onKeyPress={handleKeyPress} 
              name="confirmPassword" 
              label="Confirmar Senha"
              isLogin={isLogin}
            />
            <UserTypeField form={form} />
          </>
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