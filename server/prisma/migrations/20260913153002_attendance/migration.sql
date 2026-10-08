-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "eventVisibility" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."UserAttendance" (
    "userId" INTEGER NOT NULL,
    "larpId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAttendance_pkey" PRIMARY KEY ("userId","larpId")
);

-- AddForeignKey
ALTER TABLE "public"."UserAttendance" ADD CONSTRAINT "UserAttendance_larpId_fkey" FOREIGN KEY ("larpId") REFERENCES "public"."larps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAttendance" ADD CONSTRAINT "UserAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

