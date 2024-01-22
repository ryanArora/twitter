import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import React, { forwardRef, useState } from "react";
import { useProfile } from "./profileContext";
import { useSession } from "../../../../sessionContext";
import { api } from "@/trpc/react";

export type FollowButtonProps = Record<string, unknown>;

export const FollowButton = forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & FollowButtonProps
>(({ className, ...props }, ref) => {
  const profile = useProfile();
  const session = useSession();
  const [showUnfollowButton, setShowUnfollowButton] = useState(false);
  const utils = api.useUtils();

  const unfollowMutation = api.follow.delete.useMutation({
    onMutate: async () => {
      await utils.user.find.cancel({ username: profile.username });
      const previousProfile = utils.user.find.getData();

      utils.user.find.setData({ username: profile.username }, (data) => {
        if (!data) return;
        return {
          ...data,
          followers: data.followers.filter(
            (follow) => follow.follower.id !== session.user.id,
          ),
          _count: {
            ...data._count,
            followers: data._count.followers - 1,
          },
        };
      });

      return { previousProfile };
    },
    onError: async (err, input, context) => {
      utils.user.find.setData(
        { username: profile.username },
        context!.previousProfile,
      );
    },
  });

  const followMutation = api.follow.create.useMutation({
    onMutate: async () => {
      await utils.user.find.cancel({ username: profile.username });
      const previousProfile = utils.user.find.getData();

      utils.user.find.setData({ username: profile.username }, (data) => {
        if (!data) return;
        return {
          ...data,
          followers: [
            {
              createdAt: new Date(Date.now()),
              follower: session.user,
            },
            ...data.followers,
          ],
          _count: {
            ...data._count,
            followers: data._count.followers + 1,
          },
        };
      });

      setShowUnfollowButton(false);

      return { previousProfile };
    },
    onError: (err, input, context) => {
      utils.user.find.setData(
        { username: profile.username },
        context!.previousProfile,
      );
    },
  });

  const isFollowing = profile.followers.some(
    (follow) => follow.follower.id === session.user.id,
  );

  if (isFollowing) {
    return (
      <Button
        className={cn(
          "rounded-full font-semibold transition-colors w-[100px]",
          className,
        )}
        ref={ref}
        type="button"
        variant={showUnfollowButton ? "destructive" : "outline"}
        onMouseOver={() => {
          setShowUnfollowButton(true);
        }}
        onMouseOut={() => {
          setShowUnfollowButton(false);
        }}
        onClick={(e) => {
          if (showUnfollowButton) {
            e.preventDefault();
            unfollowMutation.mutate({ profileId: profile.id });
          }
        }}
        {...props}
      >
        {showUnfollowButton ? "Unfollow" : "Following"}
      </Button>
    );
  } else {
    return (
      <Button
        className={cn("rounded-full font-semibold", className)}
        type="button"
        variant="default"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          followMutation.mutate({ profileId: profile.id });
        }}
        {...props}
      >
        Follow
      </Button>
    );
  }
});
FollowButton.displayName = Button.displayName;
