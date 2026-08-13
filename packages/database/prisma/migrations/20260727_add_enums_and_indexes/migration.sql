-- CreateEnum
CREATE TYPE "RevisionStatus" AS ENUM ('OPEN', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "DraftStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable: convert ProfileRevision.status from String to RevisionStatus enum
ALTER TABLE "ProfileRevision" DROP COLUMN "status",
ADD COLUMN     "status" "RevisionStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable: convert ProfileEditDraft.status from String to DraftStatus enum
ALTER TABLE "ProfileEditDraft" DROP COLUMN "status",
ADD COLUMN     "status" "DraftStatus" NOT NULL DEFAULT 'PENDING';

-- DropIndex (redundant with unique index)
DROP INDEX IF EXISTS "ProfileShareToken_token_idx";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EventRegistration_userId_idx" ON "EventRegistration"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProfileEditDraft_userId_status_idx" ON "ProfileEditDraft"("userId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProfileRevision_userId_status_idx" ON "ProfileRevision"("userId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SavedPost_postId_idx" ON "SavedPost"("postId");
