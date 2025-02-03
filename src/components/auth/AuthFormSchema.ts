import * as z from "zod";

export const authFormSchema = z.object({
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .transform(val => val.toLowerCase().trim()),
  password: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
  userType: z.enum(["admin", "business_owner", "end_user"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type AuthFormValues = z.infer<typeof authFormSchema>;