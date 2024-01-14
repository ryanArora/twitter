"use client";

import { type Session } from "@repo/api/session";
import { type Expand } from "@repo/types";
import { Avatar, AvatarFallback } from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@repo/ui/components/dropdown-menu";
import { useToast } from "@repo/ui/components/use-toast";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";

export const User = ({ user }: { user: Expand<Session["user"]> }) => {
  const logout = api.auth.logout.useMutation();
  const { toast } = useToast();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center p-2 m-2 hover:bg-accent rounded-3xl">
          <Avatar>
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="mx-2 ">
            <p className="text-md">{user.name}</p>
            <p className="text-sm">@{user.username}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <Link href={`/${user.username}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <button
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
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
