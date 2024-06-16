-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'PENDING';
