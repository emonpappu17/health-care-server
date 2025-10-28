/*
  Warnings:

  - You are about to drop the column `isBlocked` on the `doctor_schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_schedule" DROP COLUMN "isBlocked",
ADD COLUMN     "isBooked" BOOLEAN NOT NULL DEFAULT false;
