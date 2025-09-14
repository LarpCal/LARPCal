/** Exports a prisma instance, or a mocked prisma instance
 * depending on the environment.
 */

import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

let prisma: PrismaClient | DeepMockProxy<PrismaClient>;

if (process.env.NODE_ENV === "test") {
  console.log("Mocking prisma for testing");
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
