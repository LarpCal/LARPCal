-- AlterTable
ALTER TABLE "_LarpToTag" ADD CONSTRAINT "_LarpToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_LarpToTag_AB_unique";
