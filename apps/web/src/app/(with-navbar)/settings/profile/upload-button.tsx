"use client";

import { Button } from "@repo/ui/components/button";
import {
  useRef,
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { type Resource } from "../../../../../../../packages/aws/src";
import { api } from "@/trpc/react";

export type UploadButtonProps = {
  resource: Resource;
};

export const UploadButton = forwardRef<
  ElementRef<typeof Button>,
  Omit<ComponentPropsWithoutRef<typeof Button>, "type"> & UploadButtonProps
>(({ resource, children, ...props }, ref) => {
  const utils = api.useUtils();
  const inputRef = useRef<HTMLInputElement>(null);

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
          form.append("file", file);

          fetch(presignedPost.url, {
            method: "POST",
            body: form,
          })
            .then(() => {
              alert("Success");
            })
            .catch(() => {
              alert("Error");
            });
        }}
      />
    </>
  );
});
UploadButton.displayName = Button.displayName;
