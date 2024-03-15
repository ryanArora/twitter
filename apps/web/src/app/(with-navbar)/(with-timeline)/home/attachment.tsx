import { Image } from "@repo/ui/components/image";
import { useToast } from "@repo/ui/components/use-toast";
import { cn } from "@repo/ui/utils";
import { XIcon } from "lucide-react";
import { type FC } from "react";
import { api } from "@/trpc/react";

export type AttachmentProps = {
  className?: string;
  attachment: {
    id: string;
    url: string;
    width: number;
    height: number;
    nativeWidth: number;
    nativeHeight: number;
  };
  showDeleteButton?: {
    enabled: true;
    // eslint-disable-next-line no-unused-vars
    removeAttachment: (id: string) => void;
  };
  disablePreview?: boolean;
};

export const Attachment: FC<AttachmentProps> = ({
  className,
  attachment,
  showDeleteButton,
  disablePreview,
}) => {
  const { toast } = useToast();
  const deleteLooseAttachment = api.asset.deleteLooseAttachment.useMutation({
    onError: () => {
      toast({
        title: "Error",
        description: "Error deleting attachment",
      });
    },
    onSuccess: () => {
      attachment.url = "";
    },
  });

  if (!showDeleteButton) {
    return (
      <Image
        className={className}
        src={attachment.url}
        alt="attachment image"
        width={attachment.width}
        height={attachment.height}
        nativeWidth={attachment.nativeWidth}
        nativeHeight={attachment.nativeHeight}
        onClick={disablePreview ? null : "focus"}
      />
    );
  }

  return (
    <div className="relative">
      <Image
        className={className}
        src={attachment.url}
        alt="attachment image"
        width={attachment.width}
        height={attachment.height}
        nativeWidth={attachment.nativeWidth}
        nativeHeight={attachment.nativeHeight}
      />
      <div
        style={{
          width: attachment.width,
          height: attachment.height,
          minWidth: attachment.width,
          minHeight: attachment.height,
        }}
        className={cn("absolute bottom-0 flex justify-end", className)}
      >
        <div
          className="m-2 h-fit rounded-full bg-black/50 p-1 hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            deleteLooseAttachment.mutate({ id: attachment.id });
            showDeleteButton.removeAttachment(attachment.id);
          }}
        >
          <XIcon />
        </div>
      </div>
    </div>
  );
};
