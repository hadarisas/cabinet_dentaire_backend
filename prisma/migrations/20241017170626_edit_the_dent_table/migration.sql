/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Dent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dent_code_key" ON "Dent"("code");
