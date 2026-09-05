/** Exports a prisma instance, or a mocked prisma instance
 * depending on the environment.
 */

import { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";

let prisma: PrismaClient | DeepMockProxy<PrismaClient>;

if (process.env.NODE_ENV === "test") {
  prisma = mockDeep<PrismaClient>();

  beforeEach(() => {
    mockReset(prisma);
  });
} else {
  prisma = new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
  });
}

export { prisma };
