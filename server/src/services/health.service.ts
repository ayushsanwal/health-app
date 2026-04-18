import { upsertHealthProfile, getHealthProfile } from "../repositories/health.repository";

const calculateBMI = (height: number, weight: number) => {
const heightInMeters = height / 100;
return weight / (heightInMeters * heightInMeters);
};

const getBMICategory = (bmi: number) => {
if (bmi < 18.5) return "underweight";
if (bmi < 25) return "normal";
if (bmi < 30) return "overweight";
return "obese";
};

export const saveHealthProfile = async (userId: string, data: any) => {
let bmi = null;
let bmiCategory = null;

if (data.height && data.weight) {
bmi = calculateBMI(data.height, data.weight);
bmiCategory = getBMICategory(bmi);
}

const profile = await upsertHealthProfile(userId, {
...data,
bmi,
bmiCategory,
});

return profile;
};

export const fetchHealthProfile = async (userId: string) => {
return getHealthProfile(userId);
};
