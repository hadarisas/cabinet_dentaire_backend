/*
  Warnings:

  - Added the required column `time` to the `RendezVous` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RendezVous" ADD COLUMN     "time" TEXT NOT NULL;
