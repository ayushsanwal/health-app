"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type HealthProfile = {
goal?: string | null;
bmi?: number | null;
bmiCategory?: string | null;
weight?: number | null;
activityLevel?: string | null;
dietPreference?: string | null;
};

type DashboardGoal = {
title: string;
targetWeight?: number | null;
targetSteps?: number | null;
targetWaterMl?: number | null;
targetSleepHrs?: number | null;
deadline?: string | null;
};

type ProgressLog = {
id: string;
logDate: string;
weight?: number | null;
sleepHrs?: number | null;
waterMl?: number | null;
steps?: number | null;
notes?: string | null;
};

type Meal = {
meal: string;
calories: number;
};

type DayPlan = {
breakfast?: Meal;
lunch?: Meal;
dinner?: Meal;
snacks?: Meal;
totalCalories?: number;
};

type MealPlanSnapshot = {
plan: Record<string, DayPlan>;
createdAt: string;
} | null;

type DashboardData = {
profile: HealthProfile | null;
goal: DashboardGoal | null;
progressLogs: ProgressLog[];
recentMealPlan: MealPlanSnapshot;
};

const API_URL = "http://localhost:5000/api";

const today = new Date().toISOString().slice(0, 10);

const emptyGoal = {
title: "",
targetWeight: "",
targetSteps: "",
targetWaterMl: "",
targetSleepHrs: "",
deadline: "",
};

const emptyProgress = {
logDate: today,
weight: "",
sleepHrs: "",
waterMl: "",
steps: "",
notes: "",
};

const formatDate = (value?: string | null) => {
if (!value) return "Not set";
return new Date(value).toLocaleDateString("en-IN", {
day: "numeric",
month: "short",
year: "numeric",
});
};

const asInputDate = (value?: string | null) => {
if (!value) return "";
return new Date(value).toISOString().slice(0, 10);
};

export default function DashboardPage() {
const [dashboard, setDashboard] = useState<DashboardData | null>(null);
const [token] = useState(() =>
typeof window !== "undefined" ? localStorage.getItem("token") : null
);
const [loading, setLoading] = useState(() => Boolean(token));
const [savingGoal, setSavingGoal] = useState(false);
const [savingProgress, setSavingProgress] = useState(false);
const [goalForm, setGoalForm] = useState(emptyGoal);
const [progressForm, setProgressForm] = useState(emptyProgress);

const authHeaders = useMemo(
() => ({
headers: {
Authorization: `Bearer ${token}`,
},
}),
[token]
);

const fetchDashboard = async () => {
try {
if (!token) {
setLoading(false);
return;
}

const res = await axios.get(`${API_URL}/dashboard`, authHeaders);
const data: DashboardData = res.data.dashboard;
setDashboard(data);

if (data.goal) {
setGoalForm({
title: data.goal.title || "",
targetWeight: data.goal.targetWeight?.toString() || "",
targetSteps: data.goal.targetSteps?.toString() || "",
targetWaterMl: data.goal.targetWaterMl?.toString() || "",
targetSleepHrs: data.goal.targetSleepHrs?.toString() || "",
deadline: asInputDate(data.goal.deadline),
});
}
} catch {
alert("Unable to load dashboard");
} finally {
setLoading(false);
}
};

useEffect(() => {
if (!token) return;

axios
.get(`${API_URL}/dashboard`, authHeaders)
.then((res) => {
const data: DashboardData = res.data.dashboard;
setDashboard(data);

if (data.goal) {
setGoalForm({
title: data.goal.title || "",
targetWeight: data.goal.targetWeight?.toString() || "",
targetSteps: data.goal.targetSteps?.toString() || "",
targetWaterMl: data.goal.targetWaterMl?.toString() || "",
targetSleepHrs: data.goal.targetSleepHrs?.toString() || "",
deadline: asInputDate(data.goal.deadline),
});
}
})
.catch(() => {
alert("Unable to load dashboard");
})
.finally(() => {
setLoading(false);
});
}, [authHeaders, token]);

const saveGoal = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();

try {
setSavingGoal(true);
await axios.put(`${API_URL}/dashboard/goal`, goalForm, authHeaders);
await fetchDashboard();
alert("Goal saved");
} catch {
alert("Unable to save goal");
} finally {
setSavingGoal(false);
}
};

const saveProgress = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();

try {
setSavingProgress(true);
await axios.post(`${API_URL}/dashboard/progress`, progressForm, authHeaders);
setProgressForm(emptyProgress);
await fetchDashboard();
alert("Progress logged");
} catch {
alert("Unable to save progress");
} finally {
setSavingProgress(false);
}
};

const latestLog = dashboard?.progressLogs[0];
const orderedLogs = [...(dashboard?.progressLogs || [])].reverse();
const mealPlan = dashboard?.recentMealPlan?.plan;
const firstMealDay = mealPlan ? Object.keys(mealPlan)[0] : null;
const firstMealPlan = firstMealDay ? mealPlan?.[firstMealDay] : null;

if (!token && !loading) {
return (
<div className="min-h-screen bg-gray-100 pt-20">
<Navbar />
<main className="max-w-3xl mx-auto px-6 py-16 text-center">
<h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
<p className="mt-4 text-gray-700">
Please login to view your health dashboard and track your progress.
</p>
<Link href="/auth">
<button className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700">
Login / Register
</button>
</Link>
</main>
</div>
);
}

return (
<div className="min-h-screen bg-gray-100 pt-20">
<Navbar />

<main className="max-w-7xl mx-auto px-6 py-10">
<div className="mb-8">
<p className="text-sm font-semibold uppercase tracking-wide text-green-700">
Personal Health
</p>
<h1 className="mt-1 text-3xl font-bold text-gray-950">
Health Dashboard
</h1>
<p className="mt-2 max-w-2xl text-gray-700">
Set your active goal, see your recent meal plan, and log daily progress.
</p>
</div>

{loading ? (
<p className="text-gray-700">Loading dashboard...</p>
) : (
<>
<section className="grid gap-4 md:grid-cols-4">
<div className="rounded-xl bg-white p-5 shadow-sm">
<p className="text-sm text-gray-600">Current Goal</p>
<p className="mt-2 text-xl font-bold text-gray-950">
{dashboard?.goal?.title || dashboard?.profile?.goal || "No goal set"}
</p>
</div>

<div className="rounded-xl bg-white p-5 shadow-sm">
<p className="text-sm text-gray-600">BMI</p>
<p className="mt-2 text-xl font-bold text-gray-950">
{dashboard?.profile?.bmi
? dashboard.profile.bmi.toFixed(1)
: "Not set"}
</p>
<p className="text-sm capitalize text-gray-600">
{dashboard?.profile?.bmiCategory || "Complete your profile"}
</p>
</div>

<div className="rounded-xl bg-white p-5 shadow-sm">
<p className="text-sm text-gray-600">Latest Weight</p>
<p className="mt-2 text-xl font-bold text-gray-950">
{latestLog?.weight || dashboard?.profile?.weight || "-"} kg
</p>
</div>

<div className="rounded-xl bg-white p-5 shadow-sm">
<p className="text-sm text-gray-600">Today Logged</p>
<p className="mt-2 text-xl font-bold text-gray-950">
{latestLog ? formatDate(latestLog.logDate) : "No logs yet"}
</p>
</div>
</section>

<section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
<form onSubmit={saveGoal} className="rounded-xl bg-white p-6 shadow-sm">
<h2 className="text-xl font-bold text-gray-950">Goal Setting</h2>
<p className="mt-1 text-sm text-gray-600">
Create one focused target for weight, steps, water, and sleep.
</p>

<div className="mt-5 grid gap-4 md:grid-cols-2">
<label className="md:col-span-2">
<span className="text-sm font-medium text-gray-700">Goal title</span>
<input
value={goalForm.title}
onChange={(event) =>
setGoalForm({ ...goalForm, title: event.target.value })
}
placeholder="Lose fat, gain stamina, or build muscle"
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
required
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Target weight kg</span>
<input
type="number"
value={goalForm.targetWeight}
onChange={(event) =>
setGoalForm({ ...goalForm, targetWeight: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Daily steps</span>
<input
type="number"
value={goalForm.targetSteps}
onChange={(event) =>
setGoalForm({ ...goalForm, targetSteps: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Water ml/day</span>
<input
type="number"
value={goalForm.targetWaterMl}
onChange={(event) =>
setGoalForm({ ...goalForm, targetWaterMl: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Sleep hours</span>
<input
type="number"
step="0.5"
value={goalForm.targetSleepHrs}
onChange={(event) =>
setGoalForm({ ...goalForm, targetSleepHrs: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label className="md:col-span-2">
<span className="text-sm font-medium text-gray-700">Deadline</span>
<input
type="date"
value={goalForm.deadline}
onChange={(event) =>
setGoalForm({ ...goalForm, deadline: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>
</div>

<button
type="submit"
className="mt-5 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
>
{savingGoal ? "Saving..." : "Save Goal"}
</button>
</form>

<form onSubmit={saveProgress} className="rounded-xl bg-white p-6 shadow-sm">
<h2 className="text-xl font-bold text-gray-950">Log Progress</h2>
<p className="mt-1 text-sm text-gray-600">
Track sleep, weight, hydration, and steps in one daily entry.
</p>

<div className="mt-5 grid gap-4 md:grid-cols-2">
<label>
<span className="text-sm font-medium text-gray-700">Date</span>
<input
type="date"
value={progressForm.logDate}
onChange={(event) =>
setProgressForm({ ...progressForm, logDate: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Weight kg</span>
<input
type="number"
step="0.1"
value={progressForm.weight}
onChange={(event) =>
setProgressForm({ ...progressForm, weight: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Sleep hours</span>
<input
type="number"
step="0.5"
value={progressForm.sleepHrs}
onChange={(event) =>
setProgressForm({ ...progressForm, sleepHrs: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Water ml</span>
<input
type="number"
value={progressForm.waterMl}
onChange={(event) =>
setProgressForm({ ...progressForm, waterMl: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label>
<span className="text-sm font-medium text-gray-700">Steps</span>
<input
type="number"
value={progressForm.steps}
onChange={(event) =>
setProgressForm({ ...progressForm, steps: event.target.value })
}
className="mt-1 w-full rounded-lg border p-3 text-gray-950"
/>
</label>

<label className="md:col-span-2">
<span className="text-sm font-medium text-gray-700">Notes</span>
<textarea
value={progressForm.notes}
onChange={(event) =>
setProgressForm({ ...progressForm, notes: event.target.value })
}
className="mt-1 min-h-24 w-full rounded-lg border p-3 text-gray-950"
placeholder="Energy level, workout, cravings, or anything useful"
/>
</label>
</div>

<button
type="submit"
className="mt-5 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-black"
>
{savingProgress ? "Saving..." : "Log Progress"}
</button>
</form>
</section>

<section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
<div className="rounded-xl bg-white p-6 shadow-sm">
<div className="flex items-center justify-between gap-4">
<div>
<h2 className="text-xl font-bold text-gray-950">Recent Meal Plan</h2>
<p className="mt-1 text-sm text-gray-600">
{dashboard?.recentMealPlan
? `Generated ${formatDate(dashboard.recentMealPlan.createdAt)}`
: "Generate a meal plan to show it here"}
</p>
</div>
<Link href="/meal" className="text-sm font-semibold text-green-700">
Open Meal Plan
</Link>
</div>

{firstMealPlan ? (
<div className="mt-5 space-y-3">
<p className="font-semibold capitalize text-gray-900">{firstMealDay}</p>
{(["breakfast", "lunch", "dinner", "snacks"] as const).map((mealType) => {
const meal = firstMealPlan[mealType];
return (
meal && (
<div
key={mealType}
className="flex justify-between gap-4 rounded-lg bg-green-50 p-3"
>
<div>
<p className="text-sm font-semibold capitalize text-green-900">
{mealType}
</p>
<p className="text-sm text-gray-700">{meal.meal}</p>
</div>
<p className="shrink-0 text-sm font-semibold text-green-700">
{meal.calories} kcal
</p>
</div>
)
);
})}
</div>
) : (
<div className="mt-5 rounded-lg bg-gray-50 p-5 text-gray-700">
No saved meal plan yet.
</div>
)}
</div>

<div className="rounded-xl bg-white p-6 shadow-sm">
<h2 className="text-xl font-bold text-gray-950">Progress History</h2>
<p className="mt-1 text-sm text-gray-600">
Your latest 14 daily logs appear here.
</p>

{orderedLogs.length === 0 ? (
<div className="mt-5 rounded-lg bg-gray-50 p-5 text-gray-700">
No progress logged yet.
</div>
) : (
<div className="mt-5 space-y-3">
{orderedLogs.map((log) => (
<div key={log.id} className="rounded-lg border p-4">
<div className="flex flex-wrap items-center justify-between gap-3">
<p className="font-semibold text-gray-900">{formatDate(log.logDate)}</p>
<p className="text-sm text-gray-600">
{log.steps || 0} steps | {log.waterMl || 0} ml |{" "}
{log.sleepHrs || 0} hrs sleep
</p>
</div>
<p className="mt-2 text-sm text-gray-700">
Weight: {log.weight ? `${log.weight} kg` : "Not logged"}
</p>
{log.notes && (
<p className="mt-1 text-sm text-gray-600">{log.notes}</p>
)}
</div>
))}
</div>
)}
</div>
</section>
</>
)}
</main>
</div>
);
}
