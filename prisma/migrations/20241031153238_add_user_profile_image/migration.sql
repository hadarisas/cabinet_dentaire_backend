/*
  Warnings:

  - You are about to drop the column `bio` on the `Utilisateur` table. All the data in the column will be lost.
  - You are about to drop the column `specialite` on the `Utilisateur` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Utilisateur" DROP COLUMN "bio",
DROP COLUMN "specialite";
