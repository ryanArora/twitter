"use client";

import { ImageOffIcon } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import React, {
  type ComponentPropsWithoutRef,
  useState,
  forwardRef,
  type ElementRef,
} from "react";
import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogPortal,
  DialogContent,
} from "./dialog";
import { cn } from "../utils";

export type ImageProps = {
  className?: string;
  width: number;
  height: number;
  nativeWidth?: number;
  nativeHeight?: number;
  href?: string;
  fallbackText?: string;
  onClick?:
    | "focus"
    | "link"
    | NonNullable<ComponentPropsWithoutRef<"img">["onClick"]>
    | null;
};

export const Image = forwardRef<
  ElementRef<typeof NextImage>,
  Omit<ComponentPropsWithoutRef<typeof NextImage>, "onClick"> & ImageProps
>(
  (
    {
      className,
      src,
      alt,
      width,
      height,
      nativeWidth = width,
      nativeHeight = height,
      href = "/",
      fallbackText,
      onClick,
      ...props
    },
    ref,
  ) => {
    type Status = "loading" | "loaded" | "error";
    const [status, setStatus] = useState<Status>("loading");
    const [isOpen, setOpen] = useState(false);
    const router = useRouter();

    return (
      <>
        <NextImage
          hidden={status !== "loaded"}
          style={{
            width,
            height,
            minWidth: width,
            minHeight: height,
          }}
          className={cn(
            onClick === "focus" || onClick === "link"
              ? "hover:cursor-pointer"
              : null,
            className,
          )}
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          ref={ref}
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
            style={{ width, height, minWidth: width, minHeight: height }}
            className={cn("bg-zinc-800", className)}
            onClick={(e) => {
              e.stopPropagation();
            }}
          ></div>
        ) : null}
        {status === "error" ? (
          <div
            style={{ width, height, minWidth: width, minHeight: height }}
            className={cn(
              "bg-zinc-800 flex items-center justify-center",
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
            open={isOpen}
            onOpenChange={(open) => {
              setOpen(open);
            }}
          >
            <DialogTrigger className="hidden" />
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <NextImage
                  className="max-w-screen max-h-screen"
                  src={src}
                  priority
                  alt={`focused: ${alt}`}
                  width={nativeWidth}
                  height={nativeHeight}
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
