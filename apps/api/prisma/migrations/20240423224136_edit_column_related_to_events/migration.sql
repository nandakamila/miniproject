/*
  Warnings:

  - You are about to drop the column `availableTicket` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the `eventsimages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `EventSchedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId]` on the table `Promotions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[participantId]` on the table `RSVP` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId]` on the table `Tickets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[participantId]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `CategoriesTickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categories` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableTicket` to the `EventSchedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EventSchedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Points` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `Promotions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RSVP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `eventsimages` DROP FOREIGN KEY `EventsImages_eventId_fkey`;

-- AlterTable
ALTER TABLE `categoriestickets` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `coupons` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `availableTicket`,
    ADD COLUMN `categories` ENUM('ART_CULTURES', 'HOBBIES', 'TRAVEL', 'FITNESS_HEALTH', 'SPIRITUALITY', 'SOCIAL', 'CHARITY', 'BUSINESS', 'EDUCATION', 'FOOD_DRINKS') NOT NULL;

-- AlterTable
ALTER TABLE `eventschedules` ADD COLUMN `availableTicket` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `participants` DROP COLUMN `point`;

-- AlterTable
ALTER TABLE `points` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `promotions` ADD COLUMN `eventId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `rsvp` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('PAID', 'NOTPAID') NOT NULL DEFAULT 'NOTPAID',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `eventsimages`;

-- CreateTable
CREATE TABLE `EventImages` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EventImages_id_key`(`id`),
    UNIQUE INDEX `EventImages_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `EventSchedules_eventId_key` ON `EventSchedules`(`eventId`);

-- CreateIndex
CREATE UNIQUE INDEX `Promotions_eventId_key` ON `Promotions`(`eventId`);

-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_userId_key` ON `RefreshToken`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Reviews_eventId_key` ON `Reviews`(`eventId`);

-- CreateIndex
CREATE UNIQUE INDEX `RSVP_participantId_key` ON `RSVP`(`participantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Tickets_eventId_key` ON `Tickets`(`eventId`);

-- CreateIndex
CREATE UNIQUE INDEX `Transactions_participantId_key` ON `Transactions`(`participantId`);

-- CreateIndex
CREATE UNIQUE INDEX `Transactions_eventId_key` ON `Transactions`(`eventId`);

-- AddForeignKey
ALTER TABLE `EventImages` ADD CONSTRAINT `EventImages_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Promotions` ADD CONSTRAINT `Promotions_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
