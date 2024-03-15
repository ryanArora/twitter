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
  disablePreview?: boolean;
}> = ({ attachments, showDeleteButtons, disablePreview }) => {
  const attachmentsExtra = attachmentDimensions(attachments.slice(0, 4));

  if (attachments.length === 0) {
    return null;
  }

  if (attachments.length === 1) {
    return (
      <div className="flex max-h-[512px] max-w-[512px] truncate">
        <Attachment
          className="w-full rounded-xl"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
      </div>
    );
  }

  if (attachments.length === 2) {
    return (
      <div className="flex max-h-[256px] max-w-[512px] truncate">
        <Attachment
          className="rounded-l-xl object-cover"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
        <Attachment
          className="rounded-r-xl object-cover"
          attachment={attachmentsExtra[1]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
      </div>
    );
  }

  if (attachments.length === 3) {
    return (
      <div className="flex max-h-[256px] max-w-[512px] truncate">
        <Attachment
          className="rounded-l-xl object-cover"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
        <div>
          <Attachment
            className="rounded-tr-xl object-cover"
            attachment={attachmentsExtra[1]}
            showDeleteButton={showDeleteButtons}
            disablePreview={disablePreview}
          />
          <Attachment
            className="rounded-br-xl object-cover"
            attachment={attachmentsExtra[2]}
            showDeleteButton={showDeleteButtons}
            disablePreview={disablePreview}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-h-[256px] max-w-[512px] truncate">
      <div>
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[0]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[1]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
      </div>
      <div>
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[2]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
        <Attachment
          className="object-cover"
          attachment={attachmentsExtra[3]}
          showDeleteButton={showDeleteButtons}
          disablePreview={disablePreview}
        />
      </div>
    </div>
  );
};
