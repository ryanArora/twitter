import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var db: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const db = globalThis.db ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.db = db;

export * from "@prisma/client";
