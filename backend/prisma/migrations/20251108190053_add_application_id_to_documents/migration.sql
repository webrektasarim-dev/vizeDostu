-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "application_id" TEXT;

-- CreateIndex
CREATE INDEX "documents_application_id_idx" ON "documents"("application_id");
