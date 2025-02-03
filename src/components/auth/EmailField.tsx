import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface EmailFieldProps {
  form: UseFormReturn<any>;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const EmailField = ({ form, onKeyPress }: EmailFieldProps) => {
  return (
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
              onKeyPress={onKeyPress}
              className="bg-white border-[#C4C4C4] focus:border-[#00BFFF] focus:ring-[#00BFFF] text-[#000000]" 
              autoComplete="email"
            />
          </FormControl>
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
};