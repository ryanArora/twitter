"use client";

import { type RouterInputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useToast } from "@repo/ui/components/use-toast";
import {
  useRef,
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { api } from "@/trpc/react";

export type UploadButtonProps = {
  resource: RouterInputs["asset"]["getPostUrl"]["resource"];
};

export const UploadButton = forwardRef<
  ElementRef<typeof Button>,
  Omit<ComponentPropsWithoutRef<typeof Button>, "type"> & UploadButtonProps
>(({ resource, children, ...props }, ref) => {
  const utils = api.useUtils();
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  return (
    <>
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          inputRef.current!.click();
        }}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={async (e) => {
          const files = e.target.files;
          if (!files) return;
          const file = files.item(0);
          if (!file) return;

          const presignedPost = await utils.asset.getPostUrl.fetch({
            resource,
          });

          const form = new FormData();
          Object.entries(presignedPost.fields).forEach(([field, value]) => {
            form.append(field, value);
          });
          form.append("Content-Type", file.type);
          form.append("file", file);

          const response = await fetch(presignedPost.url, {
            method: "POST",
            body: form,
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

          if (resource === "avatars") {
            utils.asset.getAvatarUrl.invalidate();
          } else if (resource === "banners") {
            utils.asset.getBannerUrl.invalidate();
          }

          toast({
            title: "Success",
            description: "File uploaded.",
          });
        }}
      />
    </>
  );
});
UploadButton.displayName = Button.displayName;
