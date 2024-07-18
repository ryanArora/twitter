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
import { Image } from "@repo/ui/components/image";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { useToast } from "@repo/ui/components/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarRangeIcon, Edit2Icon } from "lucide-react";
import React, { type ElementRef, type FC, useRef } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { UploadButton } from "./upload-button";
import { useProfile } from "../../(with-timeline)/[profile]/(with-profile)/profileContext";
import { type TweetBasic } from "../../../../../../../packages/api/src/router/tweet";
import { UserAvatar } from "../../user-avatar";
import { api } from "@/trpc/react";

type TimelineInfiniteData = { pages: { tweets: TweetBasic[] }[] };

export const EditProfile: FC = () => {
  const profile = useProfile();
  const queryClient = useQueryClient();

  const queryCache = queryClient.getQueryCache();
  const timelineQueryKeys = queryCache
    .getAll()
    .map((cache) => cache.queryKey)
    .filter((queryKey) => {
      const endpoint = queryKey[0] as string[];
      return endpoint[0] === "timeline";
    });

  const bannerUploadRef = useRef<ElementRef<typeof UploadButton>>(null);
  const avatarUploadRef = useRef<ElementRef<typeof UploadButton>>(null);

  const { toast } = useToast();
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    defaultValues: {
      bio: profile.bio ?? "",
      name: profile.name,
      username: profile.username,
    },
    resolver: zodResolver(updateUserSchema),
  });

  const updateUser = api.user.update.useMutation({
    onError: (err) => {
      toast({ description: err.message, title: "Error" });
    },
    onSuccess: (data, values) => {
      toast({ description: "Updated profile successfuly.", title: "Success" });

      const username = values.username ?? profile.username;
      const name = values.name ?? profile.name;
      const bio = values.bio ?? profile.bio;

      utils.user.find.setData({ username: profile.username }, (oldProfile) => {
        if (!oldProfile) return;
        return {
          ...oldProfile,
          bio,
          name,
          username,
        };
      });

      utils.user.get.setData({ id: profile.id }, (oldProfile) => {
        if (!oldProfile) return;
        return {
          ...oldProfile,
          bio,
          name,
          username,
        };
      });

      utils.auth.getSession.setData(undefined, (oldSession) => {
        if (!oldSession) return;
        return {
          ...oldSession,
          user: {
            ...oldSession.user,
            name,
            username,
          },
        };
      });

      for (const queryKey of timelineQueryKeys) {
        queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
          if (!data) return;
          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              tweets: page.tweets.map((tweet) => ({
                ...tweet,
                author:
                  tweet.author.id === profile.id
                    ? { ...tweet.author, name, username }
                    : tweet.author,
                likes: tweet.likes.map((like) => ({
                  ...like,
                  user:
                    like.user.id === profile.id
                      ? { ...like.user, name, username }
                      : like.user,
                })),
                retweets: tweet.retweets.map((retweet) => ({
                  ...retweet,
                  user:
                    retweet.user.id === profile.id
                      ? { ...retweet.user, name, username }
                      : retweet.user,
                })),
              })),
            })),
          };
        });
      }
    },
  });

  const formValues = form.watch();
  const bio = formValues.bio ?? "";
  const name = formValues.name ?? profile.name;
  const username = formValues.username ?? profile.username;

  return (
    <>
      <div className="border-b px-4 pt-4">
        <p className="mb-4 font-semibold">Preview</p>
        <div>
          <div className="relative h-[200px] w-full">
            <Image
              alt={`@${username}'s banner`}
              className="object-cover"
              draggable={false}
              fallbackText=""
              height={200}
              src={profile.bannerUrl}
              width={566}
            />

            <div
              className="absolute bottom-0 flex h-full w-full items-center justify-center bg-black opacity-0 transition-opacity hover:cursor-pointer hover:opacity-[50%]"
              onClick={(e) => {
                e.preventDefault();
                bannerUploadRef.current!.click();
              }}
            >
              <Edit2Icon fill="white" />
            </div>
            <UploadButton
              className="hidden"
              ref={bannerUploadRef}
              resource="banners"
            />
          </div>
          <div className="relative ml-[10px] mt-[-64px] h-[128px] w-[128px] rounded-full">
            <UserAvatar
              className="h-full w-full hover:cursor-pointer"
              height={128}
              onClick={(e) => {
                e.preventDefault();
                avatarUploadRef.current!.click();
              }}
              user={profile}
              width={128}
            />
            <div
              className="absolute bottom-0 flex h-full w-full items-center justify-center rounded-full bg-black opacity-0 transition-opacity hover:cursor-pointer hover:opacity-[50%]"
              onClick={(e) => {
                e.preventDefault();
                avatarUploadRef.current!.click();
              }}
            >
              <Edit2Icon fill="white" />
            </div>
            <UploadButton
              className="hidden"
              ref={avatarUploadRef}
              resource="avatars"
            />
          </div>

          <div className="p-3">
            <div className="mb-3">
              <p className="w-fit truncate text-xl font-bold">{name}</p>
              <p className="w-fit truncate text-primary/50">{`@${username}`}</p>
            </div>
            {bio && <p className="mb-3 break-words">{bio}</p>}
            <div className="flex items-center text-primary/50">
              <CalendarRangeIcon className="p-1" />
              <span className="ml-0.5 text-sm">
                {`Joined ${profile.createdAt.toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}`}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
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
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
