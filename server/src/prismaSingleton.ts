/** Exports a prisma instance, or a mocked prisma instance
 * depending on the environment.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";
import { DATABASE_URL } from "./config.ts";
import { beforeEach } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

let prisma: PrismaClient | DeepMockProxy<PrismaClient>;

if (process.env.NODE_ENV === "test") {
  prisma = mockDeep<PrismaClient>();

  beforeEach(() => {
    mockReset(prisma);
  });
} else {
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });
  prisma = new PrismaClient({
    adapter,
    // log: ['query', 'info', 'warn', 'error'],
  });
}

export { prisma };
