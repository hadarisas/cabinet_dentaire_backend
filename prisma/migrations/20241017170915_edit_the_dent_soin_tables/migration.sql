/*
  Warnings:

  - The primary key for the `Dent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Dent` table. All the data in the column will be lost.
  - The primary key for the `Soin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Soin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProduitConsommable_Soin" DROP CONSTRAINT "ProduitConsommable_Soin_soinId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_dentId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_soinId_fkey";

-- DropIndex
DROP INDEX "Dent_code_key";

-- AlterTable
ALTER TABLE "Dent" DROP CONSTRAINT "Dent_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Dent_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "Soin" DROP CONSTRAINT "Soin_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Soin_pkey" PRIMARY KEY ("code");

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_dentId_fkey" FOREIGN KEY ("dentId") REFERENCES "Dent"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProduitConsommable_Soin" ADD CONSTRAINT "ProduitConsommable_Soin_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("code") ON DELETE CASCADE ON UPDATE CASCADE;
