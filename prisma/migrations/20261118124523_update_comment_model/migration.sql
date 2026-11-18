/*
  Warnings:

  - Added the required column `name` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "surname" VARCHAR(255) NOT NULL;
