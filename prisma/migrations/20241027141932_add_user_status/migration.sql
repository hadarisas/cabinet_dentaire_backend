/*
  Warnings:

  - You are about to drop the column `factureId` on the `SoinEffectue` table. All the data in the column will be lost.
  - Added the required column `numeroFacture` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `statut` on the `Facture` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `RendezVous` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatutEnum" AS ENUM ('PAYE', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "AppointmentStatusEnum" AS ENUM ('CONFIRMED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "ProduitConsommable_Soin" DROP CONSTRAINT "ProduitConsommable_Soin_soinId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_factureId_fkey";

-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "numeroFacture" TEXT NOT NULL,
DROP COLUMN "statut",
ADD COLUMN     "statut" "StatutEnum" NOT NULL;

-- AlterTable
ALTER TABLE "RendezVous" DROP COLUMN "status",
ADD COLUMN     "status" "AppointmentStatusEnum" NOT NULL;

-- AlterTable
ALTER TABLE "SoinEffectue" DROP COLUMN "factureId";

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "statut" TEXT NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "ProduitConsommable_Soin" ADD CONSTRAINT "ProduitConsommable_Soin_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("code") ON DELETE CASCADE ON UPDATE CASCADE;
