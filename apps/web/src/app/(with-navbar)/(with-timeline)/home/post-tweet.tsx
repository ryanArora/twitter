"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { tweetContentSchema } from "@repo/api/schemas/tweet";
import { Button } from "@repo/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
} from "@repo/ui/components/form";
import { Textarea } from "@repo/ui/components/textarea";
import { useToast } from "@repo/ui/components/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { useRef, type FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AttachmentsView } from "./attatchments-view";
import { type TweetBasic } from "../../../../../../../packages/api/src/router/tweet";
import { useSession } from "../../../sessionContext";
import { UserAvatar } from "@/app/(with-navbar)/user-avatar";
import { api } from "@/trpc/react";

export const schema = z
  .object({
    content: tweetContentSchema,
    attachments: z
      .array(
        z.object({
          id: z.string().min(1),
          url: z.string().min(1),
          width: z.number().int(),
          height: z.number().int(),
        }),
      )
      .max(4),
  })
  .refine(
    (tweet) => tweet.attachments.length > 0 || tweet.content.length > 0,
    "Your tweet must not be empty.",
  );

type TimelineInfiniteData = { pages: { tweets: TweetBasic[] }[] };

type PostTweetProps = {
  inputPlaceholder: string;
  submitButtonText: string;
  parentTweetId: string | null;
  dontLinkToProfile?: boolean;
  onSuccess?: () => void;
};

export const PostTweet: FC<PostTweetProps> = ({
  inputPlaceholder,
  submitButtonText,
  parentTweetId,
  dontLinkToProfile,
  onSuccess,
}) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const queryCache = queryClient.getQueryCache();
  const timelineQueryKeys = queryCache
    .getAll()
    .map((cache) => cache.queryKey)
    .filter((queryKey) => {
      const endpoint = queryKey[0] as string[];
      return endpoint[0] === "timeline";
    });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      attachments: [],
    },
  });

  function removeAttachment(id: string) {
    form.setValue(
      "attachments",
      form
        .getValues("attachments")
        .filter((attachment) => attachment.id !== id),
    );
  }

  const postTweet = api.tweet.create.useMutation();
  const createAttachment = api.asset.createAttachment.useMutation();
  const { toast } = useToast();
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof schema>) {
    postTweet.mutate(
      {
        ...values,
        attachmentIds: values.attachments.map((attachment) => attachment.id),
        parentTweetId,
      },
      {
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
          });
        },
        onSuccess: async ({ id }) => {
          form.reset();

          for (const queryKey of timelineQueryKeys) {
            const queryKeyType = queryKey[0] as string[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const queryKeyBody = queryKey[1] as any;

            const isHome = queryKeyType[1] === "home";
            const isMyProfile =
              queryKeyType[1].startsWith("profile") &&
              queryKeyBody?.input?.profile_userId === session.user.id;
            const isReply =
              queryKeyType[1] === "tweetReplies" &&
              queryKeyBody?.input?.tweetReplies_parentId === parentTweetId;

            if (!isHome && !isMyProfile && !isReply) {
              continue;
            }

            queryClient.setQueryData(queryKey, (data: TimelineInfiniteData) => {
              const tweet = {
                _count: {
                  likes: 0,
                  replies: 0,
                  retweets: 0,
                  views: 1,
                },
                id,
                createdAt: new Date(Date.now()),
                content: values.content,
                attachments: values.attachments,
                author: session.user,
                retweets: [],
                likes: [],
              };

              if (!data) {
                return {
                  pages: [{ tweets: [tweet], nextCursor: undefined }],
                  pageParams: [],
                };
              }

              if (onSuccess) {
                onSuccess();
              }

              return {
                pages: [
                  { tweets: [tweet], nextCursor: undefined },
                  ...data.pages,
                ],
                pageParams: [],
              };
            });
          }
        },
      },
    );
  }

  function getImageData(
    file: File,
  ): Promise<{ url: string; width: number; height: number }> {
    return new Promise((resolve) => {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.onload = () => {
        const img = new Image();
        img.src = fr.result!.toString();
        img.onload = () => {
          resolve({
            url: fr.result!.toString(),
            width: img.width,
            height: img.height,
          });
        };
      };
    });
  }

  async function onAttach(file: File) {
    const { url, width, height } = await getImageData(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    createAttachment.mutate(
      { width, height },
      {
        onError: () => {
          toast({
            title: "Error",
            description: "Error creating attachment.",
          });
        },
        onSuccess: async (attachment) => {
          const presignedPost = attachment.presignedPost;

          const data = new FormData();
          Object.entries(presignedPost.fields).forEach(([field, value]) => {
            data.append(field, value);
          });
          data.append("Content-Type", file.type);
          data.append("file", file);

          const response = await fetch(presignedPost.url, {
            method: "POST",
            body: data,
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

          form.setValue("attachments", [
            ...form.getValues().attachments,
            { id: attachment.attachmentId, url, width, height },
          ]);

          form.trigger();
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form className="p-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-full p-2">
          <UserAvatar
            className="my-2 mr-1"
            user={session.user}
            onClick={dontLinkToProfile ? null : "link"}
            width={44}
            height={44}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="ml-1 mt-2 w-full">
                <FormControl>
                  <Textarea
                    className="h-[50px] min-h-[50px] border-none text-xl"
                    placeholder={inputPlaceholder}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="ml-14">
          <AttachmentsView
            attachments={form.watch("attachments")}
            showDeleteButtons={{
              enabled: true,
              removeAttachment,
            }}
          />
        </div>
        <div className="ml-14 flex justify-between border-t p-2">
          <div>
            <Button
              className="m-0 rounded-full px-1.5 text-twitter-blue transition-colors hover:bg-twitter-blue/10 hover:text-twitter-blue"
              type="button"
              variant="ghost"
              resource="attachments"
              disabled={form.watch("attachments").length >= 4}
              onClick={(e) => {
                e.preventDefault();
                attachmentInputRef.current!.click();
              }}
            >
              <ImageIcon className="p-0.5" />
            </Button>
            <input
              className="hidden"
              ref={attachmentInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                e.preventDefault();

                const files = e.target.files;
                if (!files) return;
                const file = files.item(0);
                if (!file) return;

                onAttach(file);
              }}
            />
          </div>
          <Button
            className="rounded-full bg-twitter-blue font-bold text-white transition-colors hover:bg-twitter-blue/90"
            type="submit"
            disabled={!form.formState.isValid}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
