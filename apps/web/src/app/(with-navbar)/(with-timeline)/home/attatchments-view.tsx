import { type FC } from "react";
import { Attachment } from "./attachment";
import { mapAttachmentDimensions } from "./mapAttachmentDimensions";

export const AttachmentsView: FC<{
  attachments: { id: string; url: string; width: number; height: number }[];
}> = ({ attachments }) => {
  attachments = attachments.slice(0, 4);
  attachments = mapAttachmentDimensions(attachments);

  if (attachments.length === 0) {
    return null;
  }

  if (attachments.length === 1) {
    return (
      <div className="flex max-w-[512px] max-h-[512px] truncate">
        <Attachment className="w-full rounded-xl" attachment={attachments[0]} />
      </div>
    );
  }

  if (attachments.length === 2) {
    return (
      <div className="flex max-w-[512px] max-h-[256px] truncate">
        <Attachment
          className="object-cover rounded-l-xl"
          attachment={attachments[0]}
        />
        <Attachment
          className="object-cover rounded-r-xl"
          attachment={attachments[1]}
        />
      </div>
    );
  }

  if (attachments.length === 3) {
    return (
      <div className="flex max-w-[512px] max-h-[256px] truncate">
        <Attachment
          className="object-cover rounded-l-xl"
          attachment={attachments[0]}
        />
        <div>
          <Attachment
            className="object-cover rounded-tr-xl"
            attachment={attachments[1]}
          />
          <Attachment
            className="object-cover rounded-br-xl"
            attachment={attachments[2]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[512px] max-h-[256px] truncate">
      <div>
        <Attachment className="object-cover" attachment={attachments[0]} />
        <Attachment className="object-cover" attachment={attachments[1]} />
      </div>
      <div>
        <Attachment className="object-cover" attachment={attachments[2]} />
        <Attachment className="object-cover" attachment={attachments[3]} />
      </div>
    </div>
  );
};
