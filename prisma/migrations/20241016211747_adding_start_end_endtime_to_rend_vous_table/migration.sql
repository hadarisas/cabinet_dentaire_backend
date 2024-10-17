/*
  Warnings:

  - You are about to drop the column `date` on the `RendezVous` table. All the data in the column will be lost.
  - You are about to drop the column `duree` on the `RendezVous` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `RendezVous` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `RendezVous` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RendezVous" DROP COLUMN "date",
DROP COLUMN "duree",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
