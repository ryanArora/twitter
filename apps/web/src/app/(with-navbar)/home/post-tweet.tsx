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
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { useTimelineSource } from "../timeline/timelineSourceContext";
import { UserAvatarWithLink } from "../user-avatar";
import { useSession } from "@/context/session";
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
  const { toast } = useToast();
  const utils = api.useUtils();
  const timelineSource = useTimelineSource();

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
        await utils.timeline[timelineSource].cancel();

        utils.timeline[timelineSource].setInfiniteData({}, (data) => {
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
            pages: [{ tweets: [tweet], nextCursor: undefined }, ...data.pages],
            pageParams: [],
          };
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form className="p-2 border" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex p-2 h-full">
          <UserAvatarWithLink className="my-2 mr-1" user={user} />
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
        <div className="flex justify-end">
          <Button type="submit">Post</Button>
        </div>
      </form>
    </Form>
  );
};
