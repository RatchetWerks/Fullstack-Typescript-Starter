-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordResetExpiration" DATETIME;
ALTER TABLE "User" ADD COLUMN "passwordResetToken" TEXT;
