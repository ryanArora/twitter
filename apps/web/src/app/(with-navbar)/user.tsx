"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@repo/ui/components/dropdown-menu";
import { useToast } from "@repo/ui/components/use-toast";
import { type Expand } from "@repo/utils/types";
import { LogOut, MoreVertical, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { type FC } from "react";
import { UserAvatar } from "./user-avatar";
import { type Session } from "../sessionContext";
import { api } from "@/trpc/react";

export const User: FC<{ user: Expand<Session["user"]> }> = ({ user }) => {
  const logout = api.auth.logout.useMutation();
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="m-2 flex w-64 items-center justify-between rounded-3xl p-2 hover:cursor-text hover:bg-accent">
          <div className="flex items-center truncate">
            <UserAvatar user={user} width={40} height={40} onClick={null} />
            <div className="mx-2 truncate">
              <p className="text-md truncate">{user.name}</p>
              <p className="truncate text-sm text-primary/50">{`@${user.username}`}</p>
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
            className="h-full w-full hover:cursor-pointer"
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
