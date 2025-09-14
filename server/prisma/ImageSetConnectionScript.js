const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Migrate Organizations
  const organizations = await prisma.organization.findMany();
  for (const org of organizations) {
    const newImageSet = await prisma.imageSet.create({
      data: {
        org: { connect: { id: org.id } },
      },
    });

    await prisma.organization.update({
      where: { id: org.id },
      data: { imgSetId: newImageSet.id },
    });
  }

  // Migrate Larps
  const larps = await prisma.larp.findMany();
  for (const larp of larps) {
    const newImageSet = await prisma.imageSet.create({
      data: {
        larp: { connect: { id: larp.id } },
      },
    });

    await prisma.larp.update({
      where: { id: larp.id },
      data: { imgSetId: newImageSet.id },
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
