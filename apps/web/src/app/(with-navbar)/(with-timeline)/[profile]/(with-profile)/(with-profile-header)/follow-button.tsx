import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/utils";
import React, { forwardRef, useState } from "react";
import { useSession } from "../../../../../sessionContext";
import { useProfile } from "../profileContext";
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
    onError: async (err, input, context) => {
      utils.user.find.setData(
        { username: profile.username },
        context!.previousProfile,
      );
    },
    onMutate: async () => {
      await utils.user.find.cancel({ username: profile.username });
      const previousProfile = utils.user.find.getData();

      utils.user.find.setData({ username: profile.username }, (data) => {
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

      utils.user.get.setData({ id: profile.id }, (data) => {
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

      return { previousProfile };
    },
  });

  const followMutation = api.follow.create.useMutation({
    onError: (err, input, context) => {
      utils.user.find.setData(
        { username: profile.username },
        context!.previousProfile,
      );
    },
    onMutate: async () => {
      await utils.user.find.cancel({ username: profile.username });
      const previousProfile = utils.user.find.getData();

      utils.user.find.setData({ username: profile.username }, (data) => {
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

      utils.user.get.setData({ id: profile.id }, (data) => {
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

      return { previousProfile };
    },
  });

  const isFollowing = profile.followers.some(
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
            e.preventDefault();
            unfollowMutation.mutate({ profileId: profile.id });
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
          e.preventDefault();
          followMutation.mutate({ profileId: profile.id });
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
