/*
  Warnings:

  - The primary key for the `Dent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `code` on the `Dent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dentId` on the `SoinEffectue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_dentId_fkey";

-- AlterTable
ALTER TABLE "Dent" DROP CONSTRAINT "Dent_pkey",
DROP COLUMN "code",
ADD COLUMN     "code" INTEGER NOT NULL,
ADD CONSTRAINT "Dent_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "SoinEffectue" DROP COLUMN "dentId",
ADD COLUMN     "dentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_dentId_fkey" FOREIGN KEY ("dentId") REFERENCES "Dent"("code") ON DELETE CASCADE ON UPDATE CASCADE;
