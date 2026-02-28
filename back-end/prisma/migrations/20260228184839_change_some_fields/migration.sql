/*
  Warnings:

  - You are about to drop the column `checkInPhotoUrl` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `attendance` table. All the data in the column will be lost.
  - The values [ABSENT,LEAVE] on the enum `Attendance_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `checkInPhotoUrl`,
    DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `photoUrl` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PRESENT', 'LATE') NOT NULL;
