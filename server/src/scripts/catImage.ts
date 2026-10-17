// Utilize Cat-as-a-service to add cat pics to a given larp or orga.

import { parseArgs } from "node:util";
import prisma from "../prismaClient.ts";
import {
  RESOLUTION_LG,
  RESOLUTION_MD,
  RESOLUTION_SM,
} from "../utils/imageHandler.ts";
import type { Prisma } from "../generated/prisma/client.ts";

interface ImageUrlArgs {
  id: string;
  width: number;
  height: number;
  says?: string;
}

function createImageUrl({ id, width, height, says }: ImageUrlArgs) {
  let urlBase = `https://cataas.com/cat/${id}`;
  if (says) {
    urlBase += `/says/${encodeURIComponent(says)}`;
  }

  const url = new URL(urlBase);
  url.searchParams.set("width", width.toString());
  url.searchParams.set("height", height.toString());

  return url.toString();
}

const SIZES = {
  sm: RESOLUTION_SM,
  md: RESOLUTION_MD,
  lg: RESOLUTION_LG,
} as const;
const SIZE_NAMES = ["sm", "md", "lg"] as const;

async function main() {
  const args = parseArgs({
    args: process.argv.slice(2),
    options: {
      says: { type: "string", short: "s" },
    },
    allowPositionals: true,
  });

  const [entityId, catId] = args.positionals;
  if (!entityId || !catId) {
    console.error("Provide both [entityId] and [catId]");
    return;
  }

  const imageSetId = Number.parseInt(entityId, 10);
  if (isNaN(imageSetId) || imageSetId < 0) {
    console.error("Invalid image set ID:", imageSetId);
    return;
  }

  const imageSetSizes: Prisma.ImageSetUpdateInput = {};
  for (const size of SIZE_NAMES) {
    const [width, height] = SIZES[size];
    const url = createImageUrl({
      id: catId,
      width,
      height,
      says: args.values.says,
    });
    imageSetSizes[size] = url;
  }

  await prisma.imageSet.update({
    where: { id: imageSetId },
    data: imageSetSizes,
  });
  console.log("Updated image set", imageSetId, "with new cat images");
}

main()
  .then(async () => {
    prisma.$disconnect();
    process.exit();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
