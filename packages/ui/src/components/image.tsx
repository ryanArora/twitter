"use client";

import { ImageOffIcon } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "./dialog";
import { cn } from "../utils";

export type ImageProps = {
  className?: string;
  fallbackText?: string;
  height: number;
  href?: string;
  nativeHeight?: number;
  nativeWidth?: number;
  onClick?:
    | "focus"
    | "link"
    | NonNullable<ComponentPropsWithoutRef<"img">["onClick"]>
    | null;
  width: number;
};

export const Image = forwardRef<
  ElementRef<typeof NextImage>,
  Omit<ComponentPropsWithoutRef<typeof NextImage>, "onClick"> & ImageProps
>(
  (
    {
      alt,
      className,
      fallbackText,
      height,
      href = "/",
      nativeHeight = height,
      src,
      width,
      nativeWidth = width,
      onClick,
      ...props
    },
    ref,
  ) => {
    type Status = "error" | "loaded" | "loading";
    const [status, setStatus] = useState<Status>("loading");
    const [isOpen, setOpen] = useState(false);
    const router = useRouter();

    return (
      <>
        <NextImage
          alt={alt}
          className={cn(
            onClick === "focus" || onClick === "link"
              ? "hover:cursor-pointer"
              : null,
            className,
          )}
          height={height}
          hidden={status !== "loaded"}
          priority
          ref={ref}
          src={src}
          style={{
            height,
            minHeight: height,
            minWidth: width,
            width,
          }}
          width={width}
          {...props}
          onClick={(e) => {
            e.stopPropagation();

            if (onClick === "focus") {
              setOpen(true);
              return;
            }

            if (onClick === "link") {
              router.push(href);
              return;
            }

            if (onClick) {
              onClick(e);
            }
          }}
          onError={() => {
            setStatus("error");
          }}
          onLoad={() => {
            setStatus("loaded");
          }}
        />
        {status === "loading" ? (
          <div
            className={cn("bg-zinc-800", className)}
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{ height, minHeight: height, minWidth: width, width }}
          ></div>
        ) : null}
        {status === "error" ? (
          <div
            className={cn(
              "flex items-center justify-center bg-zinc-800",
              onClick === "link" ? "hover:cursor-pointer" : null,
              className,
            )}
            onClick={(e) => {
              e.stopPropagation();

              if (onClick === "link") {
                window.location.href = href;
                return;
              }
            }}
            style={{ height, minHeight: height, minWidth: width, width }}
          >
            {fallbackText !== undefined ? (
              <p style={{ fontSize: Math.min(width, height) / 2.5 }}>
                {fallbackText}
              </p>
            ) : (
              <ImageOffIcon />
            )}
            <span className="sr-only">Error loading image</span>
          </div>
        ) : null}
        {onClick === "focus" ? (
          <Dialog
            onOpenChange={(open) => {
              setOpen(open);
            }}
            open={isOpen}
          >
            <DialogTrigger className="hidden" />
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <NextImage
                  alt={`focused: ${alt}`}
                  className="max-w-screen max-h-screen"
                  height={nativeHeight}
                  priority
                  src={src}
                  width={nativeWidth}
                />
              </DialogContent>
            </DialogPortal>
          </Dialog>
        ) : null}
      </>
    );
  },
);
Image.displayName = "Image";
