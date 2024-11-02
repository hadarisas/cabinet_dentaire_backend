/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "profilePicture";

-- AlterTable
ALTER TABLE "Utilisateur" ALTER COLUMN "profilePicture" DROP DEFAULT;
