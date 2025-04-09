import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { PasswordInput } from "../ui/password-input";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/authContext";
import { Error } from "@/Error";
import usePersistedState from "@/hooks/usePersistedState";
import { useEffect } from "react";

const registerSchema = z
  .object({
    email: z.string().min(1, { message: "Email is Required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/, {
        message:
          "Password must contain at least 6 characters, one uppercase, one lowercase and  one number",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),

    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    userName: z.string().min(1, { message: "User Name is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type RegisterSchema = z.infer<typeof registerSchema>;
export function RegisterForm() {
  const { register } = useAuth();
  const emptyFormData: RegisterSchema = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userName: "",
  };
  const { setState, readValue } = usePersistedState(
    "registerRegisterData",
    emptyFormData
  );

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: readValue(),
  });

  async function onSubmit(values: RegisterSchema) {
    setState(values);
    try {
      await register(values);
      console.log("Registred && Logged In Succesfully");
      setState(emptyFormData);
    } catch (Exception) {
      console.log("Registred  In Failed");
      console.log(Exception);
    }
  }

  return (
    <div className="mx-auto ">
      <Form {...form}>
        <Error />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto ">
          <div className="flex flex-col space-y-8 md:flex-row gap-4 md:space-y-0 ">
            <div>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormDescription className="">
                      Enter your first name
                    </FormDescription>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormDescription className="">
                      Enter your Last name
                    </FormDescription>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-8 md:flex-row gap-4 md:space-y-0 md:justify-center  ">
            <div>
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>UserName</FormLabel>
                    <FormControl>
                      <Input className="rounded-none" {...field} />
                    </FormControl>
                    <FormDescription className="">
                      Enter your Username
                    </FormDescription>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                //control acts as between react hook form and the UI custom component
                // bcz we cannot directly register the custom component with ( ...register )
                control={form.control}
                name="email"
                render={({ field }) => (
                  // field is a prop that contains properties like :
                  // onChange, onBlur, name, value, ref
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="py-[15px] rounded-none"
                        placeholder="email@email.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      Enter your Email.
                    </FormDescription>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-8 md:flex-row gap-4 md:space-y-0 ">
            <div className="basis-full">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput className="py-3 rounded-none" {...field} />
                    </FormControl>
                    <FormDescription className="">
                      Enter your password.
                    </FormDescription>
                    <FormMessage className="text-wrap" />
                  </FormItem>
                )}
              />
            </div>
            <div className="basis-full">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput className="py-3 rounded-none" {...field} />
                    </FormControl>
                    <FormDescription className="">
                      Confirm your password.
                    </FormDescription>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white hover:bg-blue-600">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
}
