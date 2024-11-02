/*
  Warnings:

  - Added the required column `bio` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialite` to the `Utilisateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT NOT NULL DEFAULT '/public/profile/user-avatar.png',
ADD COLUMN     "specialite" TEXT NOT NULL;
