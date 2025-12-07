import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import UserManager from "../models/UserManager";
import OrgManager from "../models/OrgManager";
import LarpManager from "../models/LarpManager";

const prisma = new PrismaClient();

const TEST_PASSWORD = "test123!";

async function main() {
  // Create initial users.
  await UserManager.register({
    username: "admin",
    password: TEST_PASSWORD,
    email: "admin@larpcal.com",
    isAdmin: true,
    firstName: "Admin",
    lastName: "User",
    subscribed: true,
  });
  const orgUser = await UserManager.register({
    username: "orguser",
    password: TEST_PASSWORD,
    email: "org@larpcal.com",
    firstName: "Org",
    lastName: "User",
    subscribed: true,
  });
  await UserManager.register({
    username: "normaluser",
    password: TEST_PASSWORD,
    email: "user@larpcal.com",
    firstName: "Normal",
    lastName: "User",
    subscribed: true,
  });

  // Create initial organization.
  const org = await OrgManager.createOrg({
    username: orgUser.username,
    orgName: "Test LARP Org",
    orgUrl: "https://testlarporg.com",
    description: "This is a test LARP organization.",
    email: orgUser.email,
  });

  await OrgManager.setApproved(org.id, true);

  // Insert initial LARP event.
  const larp = await LarpManager.createLarp({
    title: "Test LARP Event",
    description: "This is a test LARP event.",
    start: new Date("2024-08-01T10:00:00Z"),
    end: new Date("2024-08-05T18:00:00Z"),
    city: "Berlin",
    country: "Germany",
    orgId: org.id,
    ticketStatus: "AVAILABLE",
    tags: [],
    allDay: true,
    language: "English",
    eventUrl: "https://testlarporg.com/events/test-larp-event",
  });
  await LarpManager.publishLarp(larp.id);
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
