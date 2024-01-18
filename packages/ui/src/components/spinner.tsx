import React, { forwardRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { cn } from "../utils";

export type SpinnerProps = React.ComponentProps<"div">;

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn("flex justify-center m-2", className)}
        ref={ref}
        {...props}
      >
        <ClipLoader color="primary" size={32} />
      </div>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner };
