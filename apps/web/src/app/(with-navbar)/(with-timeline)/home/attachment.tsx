import { Image } from "@repo/ui/components/image";
import { type FC } from "react";

export const Attachment: FC<{
  className?: string;
  attachment: { id: string; url: string; width: number; height: number };
}> = ({ className, attachment }) => {
  return (
    <Image
      className={className}
      src={attachment.url}
      alt="attachment image"
      width={attachment.width}
      height={attachment.height}
      onClick="focus"
    />
  );
};
