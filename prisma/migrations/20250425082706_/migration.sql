/*
  Warnings:

  - You are about to drop the column `public_url_image` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `secure_url_image` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `url_image` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `otp_expiry` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `otp` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `public_url_image` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `secure_url_image` on the `vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `url_image` on the `vehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `brand` DROP COLUMN `public_url_image`,
    DROP COLUMN `secure_url_image`,
    DROP COLUMN `url_image`,
    ADD COLUMN `local_image_path` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `refreshtoken` MODIFY `refresh_token` VARCHAR(1024) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `otp_expiry`,
    MODIFY `otp` INTEGER NULL;

-- AlterTable
ALTER TABLE `vehicle` DROP COLUMN `public_url_image`,
    DROP COLUMN `secure_url_image`,
    DROP COLUMN `url_image`,
    ADD COLUMN `local_image_path` VARCHAR(191) NULL,
    MODIFY `specification_list` VARCHAR(191) NOT NULL;
