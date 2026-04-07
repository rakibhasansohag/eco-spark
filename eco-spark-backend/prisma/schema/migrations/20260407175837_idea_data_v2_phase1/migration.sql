-- CreateEnum
CREATE TYPE "IdeaStage" AS ENUM ('CONCEPT', 'PILOT', 'SCALING', 'IMPLEMENTED');

-- AlterTable
ALTER TABLE "ideas" ADD COLUMN     "estimatedBudgetMax" DECIMAL(65,30),
ADD COLUMN     "estimatedBudgetMin" DECIMAL(65,30),
ADD COLUMN     "expectedImpact" TEXT,
ADD COLUMN     "externalLinks" TEXT[],
ADD COLUMN     "implementationStage" "IdeaStage",
ADD COLUMN     "locationScope" TEXT,
ADD COLUMN     "risksAndMitigation" TEXT,
ADD COLUMN     "targetAudience" TEXT,
ADD COLUMN     "timelineWeeks" INTEGER;
