"use client";

import { type postTweetSchema } from "@repo/api/schemas/tweet";
import { Button } from "@repo/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
} from "@repo/ui/components/form";
import { Textarea } from "@repo/ui/components/textarea";
import { useToast } from "@repo/ui/components/use-toast";
import { ImageIcon } from "lucide-react";
import { useRef, type FC } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { AttachmentsView } from "./attatchments-view";
import { useSession } from "../../../sessionContext";
import { useTimelineSource } from "../timelineSourceContext";
import { UserAvatar } from "@/app/(with-navbar)/user-avatar";
import { api } from "@/trpc/react";

export const PostTweet: FC = () => {
  const session = useSession();
  const user = session.user;

  const form = useForm<z.infer<typeof postTweetSchema>>({
    defaultValues: {
      content: "",
      attachments: [],
    },
  });

  const postTweet = api.tweet.create.useMutation();
  const createAttachment = api.asset.createAttachment.useMutation();
  const { toast } = useToast();
  const utils = api.useUtils();
  const timelineSource = useTimelineSource();
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof postTweetSchema>) {
    postTweet.mutate(values, {
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
        });
      },
      onSuccess: async ({ id }) => {
        form.reset();
        await utils.timeline[timelineSource.path].cancel();

        utils.timeline[timelineSource.path].setInfiniteData(
          { ...timelineSource.payload },
          (data) => {
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
              attachments: values.attachments.map((attachmentId) => ({
                id: attachmentId,
              })),
              author: user,
              retweets: [],
              likes: [],
            };

            if (!data) {
              return {
                pages: [{ tweets: [tweet], nextCursor: undefined }],
                pageParams: [],
              };
            }

            return {
              pages: [
                { tweets: [tweet], nextCursor: undefined },
                ...data.pages,
              ],
              pageParams: [],
            };
          },
        );
      },
    });
  }

  function onAttach(file: File) {
    createAttachment.mutate(undefined, {
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
          attachment.attachmentId,
        ]);

        toast({
          title: "Success",
          description: "File uploaded.",
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form className="p-2 border" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex p-2 h-full">
          <UserAvatar className="my-2 mr-1" user={user} linkToProfile={true} />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full mt-2 ml-1">
                <FormControl>
                  <Textarea
                    className="text-xl min-h-[50px] h-[50px] border-none"
                    placeholder="What is happening?!"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="ml-14">
          <AttachmentsView attachmentIds={form.watch("attachments")} />
        </div>
        <div className="flex justify-between ml-14 border-t p-2">
          <div>
            <Button
              className="px-1.5 m-0 rounded-full text-twitter-blue hover:text-twitter-blue hover:bg-twitter-blue/10 transition-colors"
              type="button"
              variant="ghost"
              resource="attachments"
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
          <Button type="submit">Tweet</Button>
        </div>
      </form>
    </Form>
  );
};
