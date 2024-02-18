import { type FC } from "react";
import { Attachment } from "./attachment";
import { attachmentDimensions } from "./mapAttachmentDimensions";

export const AttachmentsView: FC<{
  attachments: { id: string; url: string; width: number; height: number }[];
  showDeleteButtons?: {
    enabled: true;
    // eslint-disable-next-line no-unused-vars
    removeAttachment: (id: string) => void;
  };
}> = ({ attachments, showDeleteButtons }) => {
  const attachmentsExtra = attachmentDimensions(attachments.slice(0, 4));

  if (attachments.length === 0) {
    return null;
  }

  if (attachments.length === 1) {
    return (
      <div className="flex max-w-[512px] max-h-[512px] truncate">
        <Attachment
          className="w-full rounded-xl"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
        />
      </div>
    );
  }

  if (attachments.length === 2) {
    return (
      <div className="flex max-w-[512px] max-h-[256px] truncate">
        <Attachment
          className="object-cover rounded-l-xl"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
        />
        <Attachment
          className="object-cover rounded-r-xl"
          attachment={attachmentsExtra[1]}
          showDeleteButton={showDeleteButtons}
        />
      </div>
    );
  }

  if (attachments.length === 3) {
    return (
      <div className="flex max-w-[512px] max-h-[256px] truncate">
        <Attachment
          className="object-cover rounded-l-xl"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
        />
        <div>
          <Attachment
            className="object-cover rounded-tr-xl"
            attachment={attachmentsExtra[1]}
            showDeleteButton={showDeleteButtons}
          />
          <Attachment
            className="object-cover rounded-br-xl"
            attachment={attachmentsExtra[2]}
            showDeleteButton={showDeleteButtons}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[512px] max-h-[256px] truncate">
      <div>
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
        />
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[1]}
          showDeleteButton={showDeleteButtons}
        />
      </div>
      <div>
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[2]}
          showDeleteButton={showDeleteButtons}
        />
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[3]}
          showDeleteButton={showDeleteButtons}
        />
      </div>
    </div>
  );
};
