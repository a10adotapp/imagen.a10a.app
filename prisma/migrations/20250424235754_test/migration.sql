/*
  Warnings:

  - You are about to drop the column `consumed_at` on the `line_stamp_generate_queue_messages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `line_stamp_generate_queue_messages` DROP COLUMN `consumed_at`;

-- AlterTable
ALTER TABLE `line_stamp_generate_queues` ADD COLUMN `consumed_at` DATETIME(3) NULL;
