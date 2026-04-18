-- CreateTable
CREATE TABLE "DashboardGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetWeight" DOUBLE PRECISION,
    "targetSteps" INTEGER,
    "targetWaterMl" INTEGER,
    "targetSleepHrs" DOUBLE PRECISION,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION,
    "sleepHrs" DOUBLE PRECISION,
    "waterMl" INTEGER,
    "steps" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPlanSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealPlanSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DashboardGoal_userId_key" ON "DashboardGoal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressLog_userId_logDate_key" ON "ProgressLog"("userId", "logDate");

-- CreateIndex
CREATE INDEX "ProgressLog_userId_logDate_idx" ON "ProgressLog"("userId", "logDate");

-- CreateIndex
CREATE INDEX "MealPlanSnapshot_userId_createdAt_idx" ON "MealPlanSnapshot"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "DashboardGoal" ADD CONSTRAINT "DashboardGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressLog" ADD CONSTRAINT "ProgressLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealPlanSnapshot" ADD CONSTRAINT "MealPlanSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
