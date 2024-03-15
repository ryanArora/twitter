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
import React, { useRef, type FC, type ElementRef } from "react";
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
      toast({ title: "Success", description: "Updated profile successfuly." });

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

      utils.user.get.setData({ id: profile.id }, (oldProfile) => {
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

  const formValues = form.watch();
  const bio = formValues.bio ?? "";
  const name = formValues.name ?? profile.name;
  const username = formValues.username ?? profile.username;

  return (
    <>
      <div className="px-4 pt-4 border-b">
        <p className="mb-4 font-semibold">Preview</p>
        <div>
          <div className="relative w-full h-[200px]">
            <Image
              className="object-cover"
              src={profile.bannerUrl}
              alt={`@${username}'s banner`}
              draggable={false}
              width={566}
              height={200}
              fallbackText=""
            />

            <div
              className="absolute bottom-0 w-full h-full transition-opacity opacity-0 hover:cursor-pointer hover:opacity-[50%] bg-black flex justify-center items-center"
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
          <div className="relative w-[128px] h-[128px] ml-[10px] mt-[-64px] rounded-full">
            <UserAvatar
              className="w-full h-full hover:cursor-pointer"
              user={profile}
              width={128}
              height={128}
              onClick={(e) => {
                e.preventDefault();
                avatarUploadRef.current!.click();
              }}
            />
            <div
              className="absolute bottom-0 w-full h-full rounded-full transition-opacity opacity-0 hover:cursor-pointer hover:opacity-[50%] bg-black flex justify-center items-center"
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
              <p className="text-xl font-bold w-fit truncate">{name}</p>
              <p className="text-primary/50 w-fit truncate">{`@${username}`}</p>
            </div>
            {bio && <p className="mb-3 break-words">{bio}</p>}
            <div className="flex items-center text-primary/50">
              <CalendarRangeIcon className="p-1" />
              <span className="ml-0.5 text-sm">
                {`Joined ${profile.createdAt.toLocaleString("default", {
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
