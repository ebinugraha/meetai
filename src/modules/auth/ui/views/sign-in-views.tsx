"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Loader2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  }),
});

export const SignInViews = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setLoading(true);
    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setLoading(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col p-6 gap-y-9">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-gray-400 font-semibold">
                Login to your account
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: johndoe@ex.com" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="type your password here"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!!error && (
                  <Alert
                    variant={"destructive"}
                    className="bg-destructive/10 border-none"
                  >
                    <TriangleAlert className="text-destructive!" />
                    <AlertTitle>{error}!</AlertTitle>
                  </Alert>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="w-full" variant={"outline"} type="button">
                    Google
                  </Button>
                  <Button className="w-full" variant={"outline"} type="button">
                    Github
                  </Button>
                </div>
                <span className="text-sm text-center">
                  don't have an account?{" "}
                  <Link
                    className="underline underline-offset-4F"
                    href={"/auth/sign-up"}
                  >
                    Sign-up
                  </Link>
                </span>
              </form>
            </Form>
          </div>
          <div className="bg-radial from-fuchsia-700 to-fuchsia-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="logo" className="w-[96px] h-[96px]" />
            <h1 className="text-white text-2xl font-semibold">Meet.Ai</h1>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a className="#">Term of service</a> and{" "}
        <a className="#">Privacy policy</a>.
      </div>
    </div>
  );
};
