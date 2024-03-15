import { type FC } from "react";
import { Attachment } from "./attachment";
import { attachmentDimensions } from "./mapAttachmentDimensions";

export const AttachmentsView: FC<{
  attachments: { height: number; id: string; url: string; width: number }[];
  disablePreview?: boolean;
  showDeleteButtons?: {
    enabled: true;
    // eslint-disable-next-line no-unused-vars
    removeAttachment: (id: string) => void;
  };
}> = ({ attachments, disablePreview, showDeleteButtons }) => {
  const attachmentsExtra = attachmentDimensions(attachments.slice(0, 4));

  if (attachments.length === 0) {
    return null;
  }

  if (attachments.length === 1) {
    return (
      <div className="flex max-h-[512px] max-w-[512px] truncate">
        <Attachment
          attachment={attachmentsExtra[0]}
          className="w-full rounded-xl"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
      </div>
    );
  }

  if (attachments.length === 2) {
    return (
      <div className="flex max-h-[256px] max-w-[512px] truncate">
        <Attachment
          attachment={attachmentsExtra[0]}
          className="rounded-l-xl object-cover"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
        <Attachment
          attachment={attachmentsExtra[1]}
          className="rounded-r-xl object-cover"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
      </div>
    );
  }

  if (attachments.length === 3) {
    return (
      <div className="flex max-h-[256px] max-w-[512px] truncate">
        <Attachment
          attachment={attachmentsExtra[0]}
          className="rounded-l-xl object-cover"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
        <div>
          <Attachment
            attachment={attachmentsExtra[1]}
            className="rounded-tr-xl object-cover"
            disablePreview={disablePreview}
            showDeleteButton={showDeleteButtons}
          />
          <Attachment
            attachment={attachmentsExtra[2]}
            className="rounded-br-xl object-cover"
            disablePreview={disablePreview}
            showDeleteButton={showDeleteButtons}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[256px] max-w-[512px] truncate">
      <div>
        <Attachment
          attachment={attachmentsExtra[0]}
          className="object-cover"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
        <Attachment
          attachment={attachmentsExtra[1]}
          className="object-cover"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
      </div>
      <div>
        <Attachment
          attachment={attachmentsExtra[2]}
          className="object-cover"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
        <Attachment
          attachment={attachmentsExtra[3]}
          className="object-cover"
          disablePreview={disablePreview}
          showDeleteButton={showDeleteButtons}
        />
      </div>
    </div>
  );
};
