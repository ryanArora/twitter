"use client";

import { type Session } from "@repo/api/session";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@repo/ui/components/dropdown-menu";
import { useToast } from "@repo/ui/components/use-toast";
import { getInitials } from "@repo/utils/str";
import { type Expand } from "@repo/utils/types";
import { LogOut, MoreVertical, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { api } from "@/trpc/react";

export const User: FC<{ user: Expand<Session["user"]> }> = ({ user }) => {
  const logout = api.auth.logout.useMutation();
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between p-2 m-2 hover:bg-accent hover:cursor-text rounded-3xl w-64">
          <div className="flex items-center truncate">
            <Avatar>
              {user.profilePictureUrl ? (
                <AvatarImage src={user.profilePictureUrl} />
              ) : null}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="mx-2 truncate">
              <p className="text-md truncate">{user.name}</p>
              <p className="text-sm truncate">@{user.username}</p>
            </div>
          </div>
          <MoreVertical />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem asChild>
          <Link href={`/${user.username}`} className="hover:cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="hover:cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className="w-full h-full hover:cursor-pointer"
            type="button"
            onClick={(e) => {
              e.preventDefault();

              logout.mutate(null, {
                onError: (err) => {
                  toast({
                    title: "Error",
                    description: err.message,
                  });
                },
                onSuccess: () => {
                  document.cookie = `session-token=; expires=${new Date(0)}`;
                  window.location.replace("/");
                },
              });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
