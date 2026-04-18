-- CreateTable
CREATE TABLE "UserHealthProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "bmi" DOUBLE PRECISION,
    "bmiCategory" TEXT,
    "goal" TEXT,
    "dietPreference" TEXT,
    "activityLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserHealthProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserHealthProfile_userId_key" ON "UserHealthProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserHealthProfile" ADD CONSTRAINT "UserHealthProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
