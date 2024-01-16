"use client";

import { type postTweetSchema } from "@repo/api/schemas/tweet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { useToast } from "@repo/ui/components/use-toast";
import { getInitials } from "@repo/utils/str";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
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

  const postTweet = api.tweet.post.useMutation({});
  const { toast } = useToast();
  const utils = api.useUtils();

  function onSubmit(values: z.infer<typeof postTweetSchema>) {
    postTweet.mutate(values, {
      onError: (err) => {
        toast({
          title: "Error",
          description: err.message,
        });
      },
      onSuccess: async ({ id }) => {
        await utils.tweet.getTimeline.cancel();

        utils.tweet.getTimeline.setInfiniteData({ limit: 10 }, (data) => {
          const tweet = {
            _count: {
              likes: 0,
              replies: 0,
              retweets: 0,
              views: 1,
            },
            attachments: values.attachments,
            author: user,
            content: values.content,
            id,
          };

          if (!data) return;
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
        <div className="flex items-center p-2">
          <Avatar className="my-2 mr-1">
            {user.profilePictureUrl ? (
              <AvatarImage src={user.profilePictureUrl} />
            ) : null}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full my-2 ml-1 h-12">
                <FormControl>
                  <Input
                    className="h-full w-full text-lg"
                    type="text"
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
