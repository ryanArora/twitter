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
import { useToast } from "@repo/ui/components/use-toast";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { api } from "@/trpc/react";
export default function Signup() {
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
        toast({
          title: "Internal Server Error",
          description: err.data?.code ?? "Internal Server Error",
        });
      },
      onSuccess: (data) => {
        toast({
          title: "Success",
          description: data.token,
        });
      },
    });
  }

  return (
    <>
      <Card className={"w-[380px]"}>
        <CardHeader>Sign Up</CardHeader>
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
                      <Input placeholder="ryanArora" {...field} />
                    </FormControl>
                    <FormDescription>This is your username</FormDescription>
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
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
