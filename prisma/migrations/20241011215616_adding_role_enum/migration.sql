/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `nom` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('DENTIST', 'ADMIN', 'ASSISTANT');

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "nom",
ADD COLUMN     "nom" "RoleEnum" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_nom_key" ON "Role"("nom");
