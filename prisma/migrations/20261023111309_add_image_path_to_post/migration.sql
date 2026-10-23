/*
  Warnings:

  - You are about to drop the column `authorId` on the `Posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_authorId_fkey";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "authorId";
