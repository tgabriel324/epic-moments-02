import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface PasswordFieldProps {
  form: UseFormReturn<any>;
  onKeyPress: (e: React.KeyboardEvent) => void;
  name: "password" | "confirmPassword";
  label: string;
  isLogin: boolean;
}

export const PasswordField = ({ form, onKeyPress, name, label, isLogin }: PasswordFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[#333333]">{label}</FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder="••••••" 
              {...field}
              onKeyPress={onKeyPress}
              className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] focus:ring-[#00BFFF] text-[#000000]" 
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </FormControl>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
};