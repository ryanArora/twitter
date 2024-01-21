"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@repo/api/schemas/user";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { useToast } from "@repo/ui/components/use-toast";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { type Profile } from "../../(with-timeline)/[profile]/(with-profile)/profileContext";
import { api } from "@/trpc/react";

export const EditProfileForm: FC<{ profile: Profile }> = ({ profile }) => {
  const { toast } = useToast();
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      bio: profile.bio ?? "",
      name: profile.name,
      username: profile.username,
    },
  });

  const updateUser = api.user.update.useMutation({
    onError: (err) => {
      toast({ title: "Error", description: err.message });
    },
    onSuccess: (data, values) => {
      const username = values.username ?? profile.username;
      const name = values.name ?? profile.name;
      const bio = values.bio ?? profile.bio;

      utils.user.find.setData({ username: profile.username }, (oldProfile) => {
        if (!oldProfile) return;
        return {
          ...oldProfile,
          username,
          name,
          bio,
        };
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit((values) => {
          updateUser.mutate(values);
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
