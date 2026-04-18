import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type GoalData = {
title: string;
targetWeight?: number | null;
targetSteps?: number | null;
targetWaterMl?: number | null;
targetSleepHrs?: number | null;
deadline?: Date | null;
};

type ProgressData = {
logDate: Date;
weight?: number | null;
sleepHrs?: number | null;
waterMl?: number | null;
steps?: number | null;
notes?: string | null;
};

export const getDashboardData = async (userId: string) => {
const [profile, goal, progressLogs, recentMealPlan] = await Promise.all([
prisma.userHealthProfile.findUnique({
where: { userId },
}),
prisma.dashboardGoal.findUnique({
where: { userId },
}),
prisma.progressLog.findMany({
where: { userId },
orderBy: { logDate: "desc" },
take: 14,
}),
prisma.mealPlanSnapshot.findFirst({
where: { userId },
orderBy: { createdAt: "desc" },
}),
]);

return {
profile,
goal,
progressLogs,
recentMealPlan,
};
};

export const upsertDashboardGoal = async (
userId: string,
data: GoalData
) => {
return prisma.dashboardGoal.upsert({
where: { userId },
update: data,
create: {
userId,
...data,
},
});
};

export const upsertProgressLog = async (
userId: string,
data: ProgressData
) => {
return prisma.progressLog.upsert({
where: {
userId_logDate: {
userId,
logDate: data.logDate,
},
},
update: data,
create: {
userId,
...data,
},
});
};

export const saveMealPlanSnapshot = async (
userId: string,
plan: unknown
) => {
return prisma.mealPlanSnapshot.create({
data: {
userId,
plan: plan as object,
},
});
};
