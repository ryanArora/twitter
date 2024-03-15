"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
            <UserAvatar height={40} onClick={null} user={user} width={40} />
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
          <Link className="hover:cursor-pointer" href={`/${user.username}`}>
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="hover:cursor-pointer" href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className="h-full w-full hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();

              logout.mutate(null, {
                onError: (err) => {
                  toast({
                    description: err.message,
                    title: "Error",
                  });
                },
                onSuccess: () => {
                  document.cookie = `session-token=; expires=${new Date(0)}`;
                  window.location.replace("/");
                },
              });
            }}
            type="button"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
