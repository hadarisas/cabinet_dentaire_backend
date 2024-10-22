/*
  Warnings:

  - You are about to drop the column `dossierMedicalId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `capacite` on the `SalleConsultation` table. All the data in the column will be lost.
  - You are about to drop the column `dossierMedicalId` on the `SoinEffectue` table. All the data in the column will be lost.
  - You are about to drop the `DossierMedical` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateEcheance` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `methodPaiement` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateDerniereRevision` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fournisseur` to the `ProduitConsommable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixUnitaire` to the `ProduitConsommable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motif` to the `RendezVous` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `RendezVous` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `RendezVous` table without a default value. This is not possible if the table is not empty.
  - Added the required column `disponibilite` to the `SalleConsultation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categorie` to the `Soin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroTelephone` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_dossierMedicalId_fkey";

-- DropForeignKey
ALTER TABLE "DossierMedical" DROP CONSTRAINT "DossierMedical_patientId_fkey";

-- DropForeignKey
ALTER TABLE "SoinEffectue" DROP CONSTRAINT "SoinEffectue_dossierMedicalId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "dossierMedicalId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "dateEcheance" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "methodPaiement" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "dateDerniereRevision" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProduitConsommable" ADD COLUMN     "fournisseur" TEXT NOT NULL,
ADD COLUMN     "prixUnitaire" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "RendezVous" ADD COLUMN     "motif" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SalleConsultation" DROP COLUMN "capacite",
ADD COLUMN     "disponibilite" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Soin" ADD COLUMN     "categorie" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SoinEffectue" DROP COLUMN "dossierMedicalId",
ADD COLUMN     "factureId" TEXT;

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "numeroTelephone" TEXT NOT NULL;

-- DropTable
DROP TABLE "DossierMedical";

-- CreateTable
CREATE TABLE "FactureSoin" (
    "id" TEXT NOT NULL,
    "factureId" TEXT NOT NULL,
    "soinId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactureSoin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactureSoin" ADD CONSTRAINT "FactureSoin_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactureSoin" ADD CONSTRAINT "FactureSoin_soinId_fkey" FOREIGN KEY ("soinId") REFERENCES "Soin"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoinEffectue" ADD CONSTRAINT "SoinEffectue_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
