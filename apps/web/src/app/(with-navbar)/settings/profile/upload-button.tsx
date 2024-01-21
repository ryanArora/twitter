"use client";

import { type FC } from "react";
import { api } from "@/trpc/react";

export const UploadButton: FC = () => {
  const utils = api.useUtils();

  return (
    <input
      type="file"
      onChange={async (e) => {
        const files = e.target.files;
        if (!files) return;
        const file = files.item(0);
        if (!file) return;

        const urlPromise = utils.asset.getUploadUrl.fetch({ path: "avatars" });
        const bufferPromise = file.arrayBuffer();
        const [url, buffer] = await Promise.all([urlPromise, bufferPromise]);

        fetch(url, {
          method: "PUT",
          body: buffer,
        })
          .then(() => {
            alert("Success");
          })
          .catch(() => {
            alert("Error");
          });
      }}
    />
  );
};
