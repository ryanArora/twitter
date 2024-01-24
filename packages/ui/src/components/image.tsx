"use client";

import { ImageOffIcon } from "lucide-react";
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
  src?: string;
  alt?: string;
  width: number;
  height: number;
  href?: string;
  fallbackText?: string;
  onClick?:
    | "focus"
    | "link"
    | NonNullable<ComponentPropsWithoutRef<"img">["onClick"]>
    | null;
};

export const Image = forwardRef<
  ElementRef<"img">,
  Omit<ComponentPropsWithoutRef<"img">, "onClick"> & ImageProps
>(
  (
    {
      className,
      src,
      alt,
      width,
      height,
      href = "/",
      fallbackText,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [isError, setError] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const router = useRouter();

    if (isError) {
      return (
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
      );
    }

    return (
      <>
        <img
          style={{ width, height, minWidth: width, minHeight: height }}
          className={cn(
            onClick === "focus" || onClick === "link"
              ? "hover:cursor-pointer"
              : null,
            className,
          )}
          hidden={!isLoaded}
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
          onLoad={() => {
            setLoaded(true);
          }}
          onError={() => {
            setError(true);
          }}
          src={src}
          alt={alt}
          ref={ref}
          {...props}
        />
        <div
          style={{ width, height, minWidth: width, minHeight: height }}
          className={cn("bg-zinc-800", className)}
          hidden={isLoaded}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
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
                <img
                  className="max-w-screen max-h-screen"
                  src={src}
                  alt={`focused: ${alt}`}
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
