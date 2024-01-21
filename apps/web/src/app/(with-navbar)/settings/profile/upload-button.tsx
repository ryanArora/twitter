"use client";

import { type RouterInputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  useRef,
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
} from "react";
import { api } from "@/trpc/react";

export type UploadButtonProps = {
  path: RouterInputs["asset"]["getPutUrl"]["resource"];
};

export const UploadButton = forwardRef<
  ElementRef<typeof Button>,
  Omit<ComponentPropsWithoutRef<typeof Button>, "type"> & UploadButtonProps
>(({ path, children, ...props }, ref) => {
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

          const urlPromise = utils.asset.getPutUrl.fetch({ resource: path });
          const bufferPromise = file.arrayBuffer();
          const [url, buffer] = await Promise.all([urlPromise, bufferPromise]);

          fetch(url, {
            method: "PUT",
            body: buffer,
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
