"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signupValidator } from "@repo/api/schemas/auth";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
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

export default function SignupForm() {
  const signup = api.auth.signup.useMutation();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupValidator>>({
    resolver: zodResolver(signupValidator),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupValidator>) {
    signup.mutate(values, {
      onError: (err) => {
        if (
          err.data?.prismaUniqueConstraintErrors.includes("username") ||
          err.data?.prismaUniqueConstraintErrors.includes("usernameLower")
        ) {
          form.setError("username", { message: "That username is taken." });
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
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[380px]">
        <CardHeader className="flex items-center">
          <TypographyH2>Sign Up</TypographyH2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>This is your name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>This is your username.</FormDescription>
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
                      <Input type="password" autoComplete="off" {...field} />
                    </FormControl>
                    <FormDescription>This is your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center items-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
