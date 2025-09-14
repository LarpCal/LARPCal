/** Encapsulates instantiation of a PrismaClient to allow
 * for easier mocking
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});
export default prisma;
