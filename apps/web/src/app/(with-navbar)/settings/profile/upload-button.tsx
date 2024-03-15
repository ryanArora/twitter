"use client";

import { type RouterInputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/components/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
  useRef,
} from "react";
import { useProfile } from "../../(with-timeline)/[profile]/(with-profile)/profileContext";
import { type TweetBasic } from "../../../../../../../packages/api/src/router/tweet";
import { api } from "@/trpc/react";

export type UploadButtonProps = {
  resource: RouterInputs["asset"]["getPostUrl"]["resource"];
};

function getDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
      const img = new Image();
      const url = (img.src = fr.result!.toString());
      resolve(url);
    };
  });
}

type TimelineInfiniteData = { pages: { tweets: TweetBasic[] }[] };

export const UploadButton = forwardRef<
  ElementRef<typeof Button>,
  Omit<ComponentPropsWithoutRef<typeof Button>, "type"> & UploadButtonProps
>(({ children, resource, ...props }, ref) => {
  const utils = api.useUtils();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
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

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          inputRef.current!.click();
        }}
        ref={ref}
        type="button"
        {...props}
      >
        {children}
      </Button>
      <input
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const files = e.target.files;
          if (!files) return;
          const file = files.item(0);
          if (!file) return;

          const presignedPost = await utils.asset.getPostUrl.fetch({
            resource,
          });

          const form = new FormData();
          Object.entries(presignedPost.fields).forEach(([field, value]) => {
            form.append(field, value);
          });
          form.append("Content-Type", file.type);
          form.append("file", file);

          const response = await fetch(presignedPost.url, {
            body: form,
            method: "POST",
          });

          if (response.status === 400) {
            toast({
              description: "File too large.",
              title: "Error",
            });
            return;
          }

          if (response.status === 403) {
            toast({
              description: "Invalid file type.",
              title: "Error",
            });
            return;
          }

          const avatarUrl =
            resource === "avatars" ? await getDataUrl(file) : profile.avatarUrl;
          const bannerUrl =
            resource === "banners" ? await getDataUrl(file) : profile.bannerUrl;

          utils.user.get.setData({ id: profile.id }, (oldProfile) => {
            if (!oldProfile) return;
            return {
              ...oldProfile,
              avatarUrl,
              bannerUrl,
            };
          });

          utils.auth.getSession.setData(undefined, (oldSession) => {
            if (!oldSession) return;
            return {
              ...oldSession,
              user: {
                ...oldSession.user,
                avatarUrl,
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
                        ? { ...tweet.author, avatarUrl }
                        : tweet.author,
                    likes: tweet.likes.map((like) => ({
                      ...like,
                      user:
                        like.user.id === profile.id
                          ? { ...like.user, avatarUrl }
                          : like.user,
                    })),
                    retweets: tweet.retweets.map((retweet) => ({
                      ...retweet,
                      user:
                        retweet.user.id === profile.id
                          ? { ...retweet.user, avatarUrl }
                          : retweet.user,
                    })),
                  })),
                })),
              };
            });
          }

          toast({
            description: "File uploaded.",
            title: "Success",
          });
        }}
        ref={inputRef}
        type="file"
      />
    </>
  );
});
UploadButton.displayName = Button.displayName;
