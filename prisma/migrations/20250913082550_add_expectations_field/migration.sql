-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'ATTENDED');

-- AlterTable
ALTER TABLE "public"."event_registrations" ADD COLUMN     "expectations" TEXT,
ADD COLUMN     "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'PENDING';
