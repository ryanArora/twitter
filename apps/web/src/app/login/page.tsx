"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@repo/api/schemas/auth";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { TypographyH2 } from "@repo/ui/components/typography";
import { useToast } from "@repo/ui/components/use-toast";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { api } from "@/trpc/react";

export default function LoginForm() {
  const login = api.auth.login.useMutation();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login.mutate(values, {
      onError: (err) => {
        if (err.data && err.data.code === "UNAUTHORIZED") {
          form.setError("password", { message: "Wrong password!" });
          return;
        }

        toast({
          title: "Error",
          description: err.message,
        });
      },
      onSuccess: (data) => {
        document.cookie = `session-token=${data.token}; expires=${data.expires}`;
        window.location.replace("/home");
      },
    });
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[380px]">
        <CardHeader className="flex items-center">
          <TypographyH2>Log In</TypographyH2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
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
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
