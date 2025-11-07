-- AlterTable
ALTER TABLE "users" ADD COLUMN     "newsletterSubscribed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "subject" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "orgId" INTEGER,
    "forceSend" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Newsletter" ADD CONSTRAINT "Newsletter_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
