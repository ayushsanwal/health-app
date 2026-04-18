import {
getDashboardData,
upsertDashboardGoal,
upsertProgressLog,
} from "../repositories/dashboard.repository";

const toNumberOrNull = (value: unknown) => {
if (value === undefined || value === null || value === "") return null;
const parsed = Number(value);
if (Number.isNaN(parsed)) {
throw new Error("Numeric fields must contain valid numbers");
}
return parsed;
};

const toIntOrNull = (value: unknown) => {
const parsed = toNumberOrNull(value);
return parsed === null ? null : Math.round(parsed);
};

const normalizeLogDate = (value: unknown) => {
const source = typeof value === "string" && value ? value : new Date().toISOString();
const date = new Date(source);

if (Number.isNaN(date.getTime())) {
throw new Error("Invalid log date");
}

date.setHours(0, 0, 0, 0);
return date;
};

export const fetchDashboard = async (userId: string) => {
return getDashboardData(userId);
};

export const saveDashboardGoal = async (userId: string, data: any) => {
if (!data.title || typeof data.title !== "string") {
throw new Error("Goal title is required");
}

const deadline = data.deadline ? new Date(data.deadline) : null;

if (deadline && Number.isNaN(deadline.getTime())) {
throw new Error("Invalid goal deadline");
}

return upsertDashboardGoal(userId, {
title: data.title,
targetWeight: toNumberOrNull(data.targetWeight),
targetSteps: toIntOrNull(data.targetSteps),
targetWaterMl: toIntOrNull(data.targetWaterMl),
targetSleepHrs: toNumberOrNull(data.targetSleepHrs),
deadline,
});
};

export const saveDailyProgress = async (userId: string, data: any) => {
return upsertProgressLog(userId, {
logDate: normalizeLogDate(data.logDate),
weight: toNumberOrNull(data.weight),
sleepHrs: toNumberOrNull(data.sleepHrs),
waterMl: toIntOrNull(data.waterMl),
steps: toIntOrNull(data.steps),
notes: data.notes || null,
});
};
