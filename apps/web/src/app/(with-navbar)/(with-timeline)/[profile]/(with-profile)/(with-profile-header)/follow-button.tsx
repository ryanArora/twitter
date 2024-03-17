import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import React, { forwardRef, useState } from "react";
import { type UserProfile } from "../../../../../../../../../packages/api/src/router/user";
import { useSession } from "../../../../../sessionContext";
import { api } from "@/trpc/react";

export type FollowButtonProps = {
  user: Pick<UserProfile, "followers" | "id" | "username">;
};

export const FollowButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & FollowButtonProps
>(({ className, user, ...props }, ref) => {
  const session = useSession();
  const [showUnfollowButton, setShowUnfollowButton] = useState(false);
  const utils = api.useUtils();

  const unfollowMutation = api.follow.delete.useMutation({
    onError: async (err, input, ctx) => {
      utils.user.find.setData(
        { username: user.username },
        ctx!.previousProfileFind,
      );

      utils.user.get.setData({ id: user.id }, ctx!.previousProfileFind);
    },
    onMutate: async () => {
      await utils.user.find.cancel({ username: user.username });
      await utils.user.get.cancel({ id: user.id });

      const previousProfileFind = utils.user.find.getData();
      const previousProfileGet = utils.user.get.getData();

      utils.user.find.setData({ username: user.username }, (data) => {
        if (!data) return;
        return {
          ...data,
          _count: {
            ...data._count,
            followers: data._count.followers - 1,
          },
          followers: data.followers.filter(
            (follow) => follow.follower.id !== session.user.id,
          ),
        };
      });

      utils.user.get.setData({ id: user.id }, (data) => {
        if (!data) return;
        return {
          ...data,
          _count: {
            ...data._count,
            followers: data._count.followers - 1,
          },
          followers: data.followers.filter(
            (follow) => follow.follower.id !== session.user.id,
          ),
        };
      });

      return { previousProfileFind, previousProfileGet };
    },
  });

  const followMutation = api.follow.create.useMutation({
    onError: (err, input, ctx) => {
      utils.user.find.setData(
        { username: user.username },
        ctx!.previousProfileFind,
      );

      utils.user.get.setData({ id: user.id }, ctx!.previousProfileGet);
    },
    onMutate: async () => {
      await utils.user.find.cancel({ username: user.username });
      await utils.user.get.cancel({ id: user.id });

      const previousProfileFind = utils.user.find.getData();
      const previousProfileGet = utils.user.get.getData();

      utils.user.find.setData({ username: user.username }, (data) => {
        if (!data) return;
        return {
          ...data,
          _count: {
            ...data._count,
            followers: data._count.followers + 1,
          },
          followers: [
            {
              createdAt: new Date(Date.now()),
              follower: session.user,
            },
            ...data.followers,
          ],
        };
      });

      utils.user.get.setData({ id: user.id }, (data) => {
        if (!data) return;
        return {
          ...data,
          _count: {
            ...data._count,
            followers: data._count.followers + 1,
          },
          followers: [
            {
              createdAt: new Date(Date.now()),
              follower: session.user,
            },
            ...data.followers,
          ],
        };
      });

      setShowUnfollowButton(false);

      return { previousProfileFind, previousProfileGet };
    },
  });

  const isFollowing = user.followers.some(
    (follow) => follow.follower.id === session.user.id,
  );

  if (isFollowing) {
    return (
      <Button
        className={cn(
          "w-[100px] rounded-full font-semibold transition-colors",
          className,
        )}
        onClick={(e) => {
          if (showUnfollowButton) {
            e.stopPropagation();
            unfollowMutation.mutate({ profileId: user.id });
          }
        }}
        onMouseOut={() => {
          setShowUnfollowButton(false);
        }}
        onMouseOver={() => {
          setShowUnfollowButton(true);
        }}
        ref={ref}
        type="button"
        variant={showUnfollowButton ? "destructive" : "outline"}
        {...props}
      >
        {showUnfollowButton ? "Unfollow" : "Following"}
      </Button>
    );
  } else {
    return (
      <Button
        className={cn("rounded-full font-semibold", className)}
        onClick={(e) => {
          e.stopPropagation();
          followMutation.mutate({ profileId: user.id });
        }}
        ref={ref}
        type="button"
        variant="default"
        {...props}
      >
        Follow
      </Button>
    );
  }
});
FollowButton.displayName = Button.displayName;
