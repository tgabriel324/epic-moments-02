import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface UserTypeFieldProps {
  form: UseFormReturn<any>;
}

export const UserTypeField = ({ form }: UserTypeFieldProps) => {
  return (
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
                  <RadioGroupItem value="admin" />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Administrador (Dono do Epic Momentos)
                </FormLabel>
              </FormItem>
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
  );
};