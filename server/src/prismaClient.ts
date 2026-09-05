/** Encapsulates instantiation of a PrismaClient to allow
 * for easier mocking
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";
import { DATABASE_URL } from "./config.ts";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({
  adapter,
  // log: ['query', 'info', 'warn', 'error'],
});
export default prisma;
