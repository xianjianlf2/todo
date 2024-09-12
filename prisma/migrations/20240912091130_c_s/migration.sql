/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_ListId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `expiredAt`,
    ADD COLUMN `expiresAt` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_ListId_fkey` FOREIGN KEY (`ListId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
