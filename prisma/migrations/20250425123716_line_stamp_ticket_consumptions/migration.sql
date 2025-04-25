-- CreateTable
CREATE TABLE `line_stamp_ticket_consumptions` (
    `id` VARCHAR(30) NOT NULL,
    `line_stamp_generate_queue_id` VARCHAR(30) NOT NULL,
    `line_stamp_ticket_id` VARCHAR(30) NOT NULL,
    `user_id` VARCHAR(30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `line_stamp_ticket_consumptions` ADD CONSTRAINT `line_stamp_ticket_consumptions_line_stamp_generate_queue_id_fkey` FOREIGN KEY (`line_stamp_generate_queue_id`) REFERENCES `line_stamp_generate_queues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `line_stamp_ticket_consumptions` ADD CONSTRAINT `line_stamp_ticket_consumptions_line_stamp_ticket_id_fkey` FOREIGN KEY (`line_stamp_ticket_id`) REFERENCES `line_stamp_tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `line_stamp_ticket_consumptions` ADD CONSTRAINT `line_stamp_ticket_consumptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
