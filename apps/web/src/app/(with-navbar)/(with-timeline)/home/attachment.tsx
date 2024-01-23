import { cn } from "@repo/ui/utils";
import { type FC } from "react";
import { api } from "@/trpc/react";

export const Attachment: FC<{
  className?: string;
  attachmentId: string;
}> = ({ className, attachmentId }) => {
  const { data: url } = api.asset.getAttachmentUrl.useQuery({
    attachmentId,
  });

  if (!url) {
    return <div className={cn("bg-red-900", className)}></div>;
  }

  return <img className={cn("", className)} src={url} alt="attachment image" />;
};
