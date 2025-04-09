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

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is Required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginSchema = z.infer<typeof loginSchema>;
export function LoginForm() {
  const { login } = useAuth();

  const { setState, readValue } = usePersistedState(
    "registerLoginData",
    {} as LoginSchema
  );
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: readValue(),
  });

  async function onSubmit(values: LoginSchema) {
    setState(values);
    try {
      await login(values);
      console.log("log in succ");
      setState({} as LoginSchema);
    } catch (Exception) {
      console.log("log in failed");
    }
  }

  return (
    <div className="mx-auto ">
      <Error />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto ">
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
                    type=""
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  Enter your username.
                </FormDescription>
                <FormMessage className="" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="********"
                    className="py-3 rounded-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="">
                  Enter your password.
                </FormDescription>
                <FormMessage className="" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white hover:bg-blue-600">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
