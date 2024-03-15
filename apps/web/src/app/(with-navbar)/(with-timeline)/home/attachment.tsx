import { Image } from "@repo/ui/components/image";
import { useToast } from "@repo/ui/components/use-toast";
import { cn } from "@repo/ui/utils";
import { XIcon } from "lucide-react";
import { type FC } from "react";
import { api } from "@/trpc/react";

export type AttachmentProps = {
  attachment: {
    height: number;
    id: string;
    nativeHeight: number;
    nativeWidth: number;
    url: string;
    width: number;
  };
  className?: string;
  disablePreview?: boolean;
  showDeleteButton?: {
    enabled: true;
    // eslint-disable-next-line no-unused-vars
    removeAttachment: (id: string) => void;
  };
};

export const Attachment: FC<AttachmentProps> = ({
  attachment,
  className,
  disablePreview,
  showDeleteButton,
}) => {
  const { toast } = useToast();
  const deleteLooseAttachment = api.asset.deleteLooseAttachment.useMutation({
    onError: () => {
      toast({
        description: "Error deleting attachment",
        title: "Error",
      });
    },
    onSuccess: () => {
      attachment.url = "";
    },
  });

  if (!showDeleteButton) {
    return (
      <Image
        alt="attachment image"
        className={className}
        height={attachment.height}
        nativeHeight={attachment.nativeHeight}
        nativeWidth={attachment.nativeWidth}
        onClick={disablePreview ? null : "focus"}
        src={attachment.url}
        width={attachment.width}
      />
    );
  }

  return (
    <div className="relative">
      <Image
        alt="attachment image"
        className={className}
        height={attachment.height}
        nativeHeight={attachment.nativeHeight}
        nativeWidth={attachment.nativeWidth}
        src={attachment.url}
        width={attachment.width}
      />
      <div
        className={cn("absolute bottom-0 flex justify-end", className)}
        style={{
          height: attachment.height,
          minHeight: attachment.height,
          minWidth: attachment.width,
          width: attachment.width,
        }}
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
