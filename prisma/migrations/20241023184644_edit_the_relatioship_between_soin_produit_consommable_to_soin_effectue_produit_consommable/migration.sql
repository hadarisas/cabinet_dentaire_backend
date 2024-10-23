/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProduitConsommable_Soin" DROP CONSTRAINT "ProduitConsommable_Soin_soinId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- AddForeignKey
ALTER TABLE "ProduitConsommable_Soin" ADD CONSTRAINT "ProduitConsommable_Soin_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "SoinEffectue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
