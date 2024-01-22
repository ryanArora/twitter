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

      utils.auth.getSession.setData(undefined, (oldSession) => {
        if (!oldSession) return;
        return {
          ...oldSession,
          user: {
            ...oldSession.user,
            username,
            name,
          },
        };
      });

      const timelines = [
        {
          path: "home",
          payload: { profileId: "" },
        },
        {
          path: "profile",
          payload: { profileId: profile.id },
        },
        {
          path: "replies",
          payload: { profileId: profile.id },
        },
        {
          path: "media",
          payload: { profileId: profile.id },
        },
        {
          path: "likes",
          payload: { profileId: profile.id },
        },
      ] as const;

      for (const { path, payload } of timelines) {
        utils.timeline[path].setInfiniteData({ ...payload }, (data) => {
          if (!data) return;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              tweets: page.tweets.map((tweet) => ({
                ...tweet,
                author:
                  tweet.author.id === profile.id
                    ? { ...tweet.author, username, name }
                    : tweet.author,
                likes: tweet.likes.map((like) => ({
                  ...like,
                  user:
                    like.user.id === profile.id
                      ? { ...like.user, username, name }
                      : like.user,
                })),
                retweets: tweet.retweets.map((retweet) => ({
                  ...retweet,
                  user:
                    retweet.user.id === profile.id
                      ? { ...retweet.user, username, name }
                      : retweet.user,
                })),
              })),
            })),
          };
        });
      }
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
