type Attachment = {
  height: number;
  id: string;
  url: string;
  width: number;
};

type AttachmentExtra = {
  height: number;
  id: string;
  nativeHeight: number;
  nativeWidth: number;
  url: string;
  width: number;
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

  let newWidth: null | number = null;
  let newHeight: null | number = null;

  if (width === 0 || height === 0) {
    return [
      {
        ...one,
        height: 512,
        nativeHeight: one.height,
        nativeWidth: one.width,
        width: 512,
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
      height: newHeight,
      nativeHeight: one.height,
      nativeWidth: one.width,
      width: newWidth,
    },
  ];
}

function map_two(one: Attachment, two: Attachment): AttachmentExtra[] {
  return [
    {
      ...one,
      height: 256,
      nativeHeight: one.height,
      nativeWidth: one.width,
      width: 256,
    },
    {
      ...two,
      height: 256,
      nativeHeight: two.height,
      nativeWidth: two.width,
      width: 256,
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
      height: 256,
      nativeHeight: one.height,
      nativeWidth: one.width,
      width: 256,
    },
    {
      ...two,
      height: 128,
      nativeHeight: two.height,
      nativeWidth: two.width,
      width: 256,
    },
    {
      ...three,
      height: 128,
      nativeHeight: three.height,
      nativeWidth: three.width,
      width: 256,
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
      height: 128,
      nativeHeight: one.height,
      nativeWidth: one.width,
      width: 256,
    },
    {
      ...two,
      height: 128,
      nativeHeight: two.height,
      nativeWidth: two.width,
      width: 256,
    },
    {
      ...three,
      height: 128,
      nativeHeight: three.height,
      nativeWidth: three.width,
      width: 256,
    },
    {
      ...four,
      height: 128,
      nativeHeight: four.height,
      nativeWidth: four.width,
      width: 256,
    },
  ];
}
