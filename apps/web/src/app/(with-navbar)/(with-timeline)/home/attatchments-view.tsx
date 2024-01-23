import { type FC } from "react";
import { Attachment } from "./attachment";

export const AttachmentsView: FC<{
  attachmentIds: string[];
}> = ({ attachmentIds }) => {
  attachmentIds = attachmentIds.slice(0, 4);

  if (attachmentIds.length === 0) {
    return null;
  }

  if (attachmentIds.length === 1) {
    return (
      <div className="flex w-[512px] max-h-[512px]">
        <Attachment
          className="w-full object-contain object-left-top"
          attachmentId={attachmentIds[0]}
        />
      </div>
    );
  }

  if (attachmentIds.length === 2) {
    return (
      <div className="flex">
        <Attachment
          className="w-[256px] max-h-[256px] object-cover"
          attachmentId={attachmentIds[0]}
        />
        <Attachment
          className="w-[256px] max-h-[256px] object-cover"
          attachmentId={attachmentIds[1]}
        />
      </div>
    );
  }

  if (attachmentIds.length === 3) {
    return (
      <div className="flex">
        <Attachment
          className="w-[256px] h-[256px] object-cover"
          attachmentId={attachmentIds[0]}
        />
        <div>
          <Attachment
            className="w-[256px] h-[128px] object-cover"
            attachmentId={attachmentIds[1]}
          />
          <Attachment
            className="w-[256px] h-[128px] object-cover"
            attachmentId={attachmentIds[2]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div>
        <Attachment
          className="w-[256px] h-[128px] object-cover"
          attachmentId={attachmentIds[0]}
        />
        <Attachment
          className="w-[256px] h-[128px] object-cover"
          attachmentId={attachmentIds[1]}
        />
      </div>
      <div>
        <Attachment
          className="w-[256px] h-[128px] object-cover"
          attachmentId={attachmentIds[2]}
        />
        <Attachment
          className="w-[256px] h-[128px] object-cover"
          attachmentId={attachmentIds[3]}
        />
      </div>
    </div>
  );
};
