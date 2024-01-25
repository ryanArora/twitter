type Attachment = {
  id: string;
  url: string;
  width: number;
  height: number;
};

type AttachmentExtra = {
  id: string;
  url: string;
  width: number;
  height: number;
  nativeWidth: number;
  nativeHeight: number;
};

export function attachmentDimensions(
  attachments: Attachment[],
): AttachmentExtra[] {
  if (attachments.length === 0) {
    return [];
  }

  if (attachments.length === 1) {
    return map_one(attachments[0]);
  }

  if (attachments.length === 2) {
    return map_two(attachments[0], attachments[1]);
  }

  if (attachments.length === 3) {
    return map_three(attachments[0], attachments[1], attachments[2]);
  }

  if (attachments.length === 4) {
    return map_four(
      attachments[0],
      attachments[1],
      attachments[2],
      attachments[3],
    );
  }

  throw new Error();
}

function map_one(one: Attachment): AttachmentExtra[] {
  const width = one.width;
  const height = one.height;

  let newWidth: number | null = null;
  let newHeight: number | null = null;

  if (width === 0 || height === 0) {
    return [
      {
        ...one,
        nativeWidth: one.width,
        nativeHeight: one.height,
        width: 512,
        height: 512,
      },
    ];
  }

  if (width >= 512 || height >= 512) {
    if (width >= height) {
      const ratio = height / width;
      newWidth = Math.min(width, 512);
      newHeight = ratio * newWidth;
    } else {
      const ratio = width / height;
      newHeight = Math.min(height, 512);
      newWidth = ratio * newHeight;
    }
  } else {
    if (width >= height) {
      const ratio = height / width;
      newWidth = 512;
      newHeight = ratio * newWidth;
    } else {
      const ratio = width / height;
      newHeight = 512;
      newWidth = ratio * newHeight;
    }
  }

  return [
    {
      ...one,
      nativeWidth: one.width,
      nativeHeight: one.height,
      width: newWidth,
      height: newHeight,
    },
  ];
}

function map_two(one: Attachment, two: Attachment): AttachmentExtra[] {
  return [
    {
      ...one,
      nativeWidth: one.width,
      nativeHeight: one.height,
      width: 256,
      height: 256,
    },
    {
      ...two,
      nativeWidth: two.width,
      nativeHeight: two.height,
      width: 256,
      height: 256,
    },
  ];
}

function map_three(
  one: Attachment,
  two: Attachment,
  three: Attachment,
): AttachmentExtra[] {
  return [
    {
      ...one,
      nativeWidth: one.width,
      nativeHeight: one.height,
      width: 256,
      height: 256,
    },
    {
      ...two,
      nativeWidth: two.width,
      nativeHeight: two.height,
      width: 256,
      height: 128,
    },
    {
      ...three,
      nativeWidth: three.width,
      nativeHeight: three.height,
      width: 256,
      height: 128,
    },
  ];
}

function map_four(
  one: Attachment,
  two: Attachment,
  three: Attachment,
  four: Attachment,
): AttachmentExtra[] {
  return [
    {
      ...one,
      nativeWidth: one.width,
      nativeHeight: one.height,
      width: 256,
      height: 128,
    },
    {
      ...two,
      nativeWidth: two.width,
      nativeHeight: two.height,
      width: 256,
      height: 128,
    },
    {
      ...three,
      nativeWidth: three.width,
      nativeHeight: three.height,
      width: 256,
      height: 128,
    },
    {
      ...four,
      nativeWidth: four.width,
      nativeHeight: four.height,
      width: 256,
      height: 128,
    },
  ];
}
