/*
  Warnings:

  - You are about to alter the column `clerkId` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `categoriestickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventimages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventschedules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organizers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `points` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promotions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refreshtoken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rsvp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tickets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `coupons` DROP FOREIGN KEY `Coupons_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `eventimages` DROP FOREIGN KEY `EventImages_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `Events_organizerId_fkey`;

-- DropForeignKey
ALTER TABLE `eventschedules` DROP FOREIGN KEY `EventSchedules_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `favorites` DROP FOREIGN KEY `Favorites_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `favorites` DROP FOREIGN KEY `Favorites_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `organizers` DROP FOREIGN KEY `Organizers_userId_fkey`;

-- DropForeignKey
ALTER TABLE `participants` DROP FOREIGN KEY `Participants_userId_fkey`;

-- DropForeignKey
ALTER TABLE `points` DROP FOREIGN KEY `Points_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `promotions` DROP FOREIGN KEY `Promotions_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `Reviews_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `rsvp` DROP FOREIGN KEY `RSVP_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `Tickets_categoriesTicketId_fkey`;

-- DropForeignKey
ALTER TABLE `tickets` DROP FOREIGN KEY `Tickets_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_eventId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `transactions` DROP FOREIGN KEY `Transactions_pointId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `clerkId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `categoriestickets`;

-- DropTable
DROP TABLE `coupons`;

-- DropTable
DROP TABLE `eventimages`;

-- DropTable
DROP TABLE `events`;

-- DropTable
DROP TABLE `eventschedules`;

-- DropTable
DROP TABLE `favorites`;

-- DropTable
DROP TABLE `organizers`;

-- DropTable
DROP TABLE `participants`;

-- DropTable
DROP TABLE `points`;

-- DropTable
DROP TABLE `promotions`;

-- DropTable
DROP TABLE `refreshtoken`;

-- DropTable
DROP TABLE `reviews`;

-- DropTable
DROP TABLE `rsvp`;

-- DropTable
DROP TABLE `tickets`;

-- DropTable
DROP TABLE `transactions`;

-- DropTable
DROP TABLE `users`;
