import { Image } from "@repo/ui/components/image";
import { type FC } from "react";
import { api } from "@/trpc/react";

export const Attachment: FC<{
  className?: string;
  attachment: { id: string; width: number; height: number };
}> = ({ className, attachment }) => {
  const { data: url } = api.asset.getAttachmentUrl.useQuery(
    {
      attachmentId: attachment.id,
    },
    {
      gcTime: 1000 * 60 * 5,
    },
  );

  return (
    <Image
      className={className}
      src={url}
      alt="attachment image"
      width={attachment.width}
      height={attachment.height}
      onClick="focus"
    />
  );
};
