"use client";

import { type RouterInputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/components/use-toast";
import {
  useRef,
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { useProfile } from "../../(with-timeline)/[profile]/(with-profile)/profileContext";
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

export const UploadButton = forwardRef<
  ElementRef<typeof Button>,
  Omit<ComponentPropsWithoutRef<typeof Button>, "type"> & UploadButtonProps
>(({ resource, children, ...props }, ref) => {
  const utils = api.useUtils();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const profile = useProfile();

  return (
    <>
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current!.click();
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        ref={inputRef}
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
            method: "POST",
            body: form,
          });

          if (response.status === 400) {
            toast({
              title: "Error",
              description: "File too large.",
            });
            return;
          }

          if (response.status === 403) {
            toast({
              title: "Error",
              description: "Invalid file type.",
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
            title: "Success",
            description: "File uploaded.",
          });
        }}
      />
    </>
  );
});
UploadButton.displayName = Button.displayName;
