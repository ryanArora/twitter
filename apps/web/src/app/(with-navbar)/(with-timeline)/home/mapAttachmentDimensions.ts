type Attachment = {
  id: string;
  width: number;
  height: number;
};

export function mapAttachmentDimensions(attachments: Attachment[]) {
  if (attachments.length === 0) {
    return attachments;
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

function map_one(one: Attachment) {
  const width = one.width;
  const height = one.height;

  let newWidth: number | null = null;
  let newHeight: number | null = null;

  if (width === 0 || height === 0) {
    return [
      {
        id: one.id,
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
      id: one.id,
      width: newWidth,
      height: newHeight,
    },
  ];
}

function map_two(one: Attachment, two: Attachment) {
  return [
    {
      id: one.id,
      width: 256,
      height: Math.min(one.height, 256),
    },
    {
      id: two.id,
      width: 256,
      height: Math.min(two.height, 256),
    },
  ];
}

function map_three(one: Attachment, two: Attachment, three: Attachment) {
  return [
    {
      id: one.id,
      width: 256,
      height: Math.min(one.height, 256),
    },
    {
      id: two.id,
      width: 256,
      height: Math.min(two.height, 128),
    },
    {
      id: three.id,
      width: 256,
      height: Math.min(two.height, 128),
    },
  ];
}

function map_four(
  one: Attachment,
  two: Attachment,
  three: Attachment,
  four: Attachment,
) {
  return [
    {
      id: one.id,
      width: 256,
      height: Math.min(one.height, 128),
    },
    {
      id: two.id,
      width: 256,
      height: Math.min(one.height, 128),
    },
    {
      id: three.id,
      width: 256,
      height: Math.min(one.height, 128),
    },
    {
      id: four.id,
      width: 256,
      height: Math.min(one.height, 128),
    },
  ];
}
